import { prisma } from "../config/prisma";
import { crearPedido } from "./pedido.service";

// Obtiene el carrito existente o crea uno nuevo para la session_id dada.
const getOrCreate = async (session_id: string, cliente_id?: number) => {
  let carrito = await prisma.carritos.findUnique({ where: { session_id } });

  if (!carrito) {
    carrito = await prisma.carritos.create({
      data: {
        session_id,
        cliente_id: cliente_id ?? null,
      },
    });
  } else if (cliente_id && carrito.cliente_id === null) {
    carrito = await prisma.carritos.update({
      where: { session_id },
      data: { cliente_id },
    });
  }

  return carrito;
};

export const getCarrito = async (session_id: string) => {
  const carrito = await prisma.carritos.findUnique({
    where: { session_id },
    include: {
      carrito_items: {
        include: {
          productos: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              imagen: true,
              precio_venta: true,
              stock: true,
              activo: true,
            },
          },
        },
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!carrito) {
    return { session_id, items: [], subtotal: 0, total_items: 0 };
  }

  const items = carrito.carrito_items.map((item) => ({
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: Number(item.precio_unitario),
    subtotal: Number(item.precio_unitario) * item.cantidad,
    producto: item.productos,
  }));

  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const total_items = items.reduce((acc, i) => acc + i.cantidad, 0);

  return { session_id, carrito_id: carrito.id, cliente_id: carrito.cliente_id, items, subtotal, total_items };
};

export const addOrUpdateItem = async (
  session_id: string,
  producto_id: number,
  cantidad: number,
  cliente_id?: number
) => {
  if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");

  const producto = await prisma.productos.findUnique({ where: { id: producto_id } });
  if (!producto || !producto.activo) throw new Error("Producto no encontrado o inactivo");
  if (producto.stock < cantidad) {
    throw new Error(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock})`);
  }

  const carrito = await getOrCreate(session_id, cliente_id);

  await prisma.carrito_items.upsert({
    where: { carrito_id_producto_id: { carrito_id: carrito.id, producto_id } },
    create: {
      carrito_id: carrito.id,
      producto_id,
      cantidad,
      precio_unitario: producto.precio_venta,
    },
    update: {
      cantidad,
      precio_unitario: producto.precio_venta,
    },
  });

  await prisma.carritos.update({
    where: { id: carrito.id },
    data: { updated_at: new Date() },
  });

  return getCarrito(session_id);
};

export const removeItem = async (session_id: string, producto_id: number) => {
  const carrito = await prisma.carritos.findUnique({ where: { session_id } });
  if (!carrito) throw new Error("Carrito no encontrado");

  await prisma.carrito_items.deleteMany({
    where: { carrito_id: carrito.id, producto_id },
  });

  return getCarrito(session_id);
};

export const clearCarrito = async (session_id: string) => {
  const carrito = await prisma.carritos.findUnique({ where: { session_id } });
  if (!carrito) throw new Error("Carrito no encontrado");

  await prisma.carrito_items.deleteMany({ where: { carrito_id: carrito.id } });

  return getCarrito(session_id);
};

export const checkout = async (
  session_id: string,
  data: {
    direccion_entrega: string;
    observaciones?: string;
    cliente_id?: number;
    nombre?: string;
    telefono?: string;
    email?: string;
  }
) => {
  const carrito = await getCarrito(session_id);

  if (!carrito.items || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const pedido = await crearPedido({
    cliente_id: data.cliente_id ?? carrito.cliente_id ?? undefined,
    nombre: data.nombre,
    telefono: data.telefono,
    email: data.email,
    direccion_entrega: data.direccion_entrega,
    observaciones: data.observaciones,
    productos: carrito.items.map((i) => ({
      producto_id: i.producto_id,
      cantidad: i.cantidad,
    })),
  });

  // Vaciar el carrito tras el checkout exitoso
  if (carrito.carrito_id) {
    await prisma.carrito_items.deleteMany({ where: { carrito_id: carrito.carrito_id } });
  }

  return pedido;
};
