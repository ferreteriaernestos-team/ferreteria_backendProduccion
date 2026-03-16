import { prisma } from "../config/prisma";

export const crearOrdenCompra = async (data: any, usuario_id: number) => {

  let total = 0;

  data.productos.forEach((p: any) => {
    total += p.cantidad * p.precio_unitario;
  });

  const orden = await prisma.ordenes_compra.create({
    data: {
      proveedor_id: data.proveedor_id,
      usuario_id,
      total,
      estado: "PENDIENTE"
    }
  });

  for (const p of data.productos) {

    const subtotal = p.cantidad * p.precio_unitario;

    await prisma.detalle_orden_compra.create({
      data: {
        orden_id: orden.id,
        producto_id: p.producto_id,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        subtotal
      }
    });

  }

  return orden;
};

export const getOrdenesCompra = async () => {

  return prisma.ordenes_compra.findMany({
    include: {
      proveedores: true
    },
    orderBy: {
      created_at: "desc"
    }
  });

};

export const getOrdenCompraById = async (id: number) => {

  return prisma.ordenes_compra.findUnique({
    where: { id },
    include: {
      detalle_orden_compra: true,
      proveedores: true
    }
  });

};

export const recibirOrdenCompra = async (orden_id: number, usuario_id: number) => {

  const orden = await prisma.ordenes_compra.findUnique({
    where: { id: orden_id },
    include: {
      detalle_orden_compra: true
    }
  });

  if (!orden) {
    throw new Error("Orden de compra no encontrada");
  }

  if (orden.estado !== "PENDIENTE") {
    throw new Error("La orden ya fue procesada");
  }

  for (const detalle of orden.detalle_orden_compra) {

    await prisma.productos.update({
      where: { id: detalle.producto_id },
      data: {
        stock: {
          increment: detalle.cantidad
        }
      }
    });

    await prisma.movimientos_inventario.create({
      data: {
        producto_id: detalle.producto_id,
        usuario_id,
        tipo: "ENTRADA",
        cantidad: detalle.cantidad,
        referencia: `OC-${orden.id}`,
        observacion: "Recepción de orden de compra"
      }
    });

  }

  await prisma.ordenes_compra.update({
    where: { id: orden_id },
    data: {
      estado: "RECIBIDO"
    }
  });

  return { message: "Orden recibida y stock actualizado" };

};