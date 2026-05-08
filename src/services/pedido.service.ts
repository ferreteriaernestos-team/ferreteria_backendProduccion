import crypto from "crypto";
import { prisma } from "../config/prisma";
import { sendWhatsappMessage } from "./whatsapp.service";

const EXPIRY_MINUTES = parseInt(process.env.PEDIDO_EXPIRY_MINUTES || "5", 10);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generarToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function calcularExpiracion(): Date {
  return new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
}

function formatearDetalle(items: { nombre: string; cantidad: number; subtotal: any }[]): string {
  return items
    .map((i) => `• ${i.nombre} x${i.cantidad} — $${Number(i.subtotal).toFixed(2)}`)
    .join("\n");
}

// ─── Crear pedido ─────────────────────────────────────────────────────────────

export interface CrearPedidoInput {
  // Cliente existente o datos para crear uno nuevo
  cliente_id?: number;
  nombre?: string;
  telefono?: string;
  email?: string;
  // Datos del pedido
  direccion_entrega: string;
  observaciones?: string;
  productos: { producto_id: number; cantidad: number }[];
}

export const crearPedido = async (data: CrearPedidoInput) => {
  // Resolver o crear cliente
  let cliente_id = data.cliente_id;

  if (!cliente_id) {
    if (!data.nombre || !data.telefono) {
      throw new Error("Se requiere nombre y teléfono para clientes sin cuenta");
    }

    // Buscar por teléfono para no duplicar
    const existente = await prisma.clientes.findFirst({
      where: { telefono: data.telefono },
    });

    if (existente) {
      cliente_id = existente.id;
    } else {
      const nuevo = await prisma.clientes.create({
        data: {
          nombre: data.nombre,
          telefono: data.telefono,
          email: data.email ?? null,
        },
      });
      cliente_id = nuevo.id;
    }
  }

  // Validar productos y calcular total
  const productosIds = data.productos.map((p) => p.producto_id);
  const productosDB = await prisma.productos.findMany({
    where: { id: { in: productosIds }, activo: true },
    select: { id: true, nombre: true, precio_venta: true, stock: true },
  });

  if (productosDB.length !== productosIds.length) {
    throw new Error("Uno o más productos no existen o están inactivos");
  }

  for (const item of data.productos) {
    const prod = productosDB.find((p) => p.id === item.producto_id)!;
    if (prod.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para "${prod.nombre}" (disponible: ${prod.stock})`);
    }
  }

  let total = 0;
  const detalles = data.productos.map((item) => {
    const prod = productosDB.find((p) => p.id === item.producto_id)!;
    const precio_unitario = Number(prod.precio_venta);
    const subtotal = precio_unitario * item.cantidad;
    total += subtotal;
    return {
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario,
      subtotal,
      nombre: prod.nombre,
    };
  });

  // Crear pedido con detalles en transacción
  const token = generarToken();
  const pedido = await prisma.$transaction(async (tx) => {
    const nuevoPedido = await tx.pedidos.create({
      data: {
        cliente_id: cliente_id!,
        total,
        token_confirmacion: token,
        direccion_entrega: data.direccion_entrega,
        observaciones: data.observaciones ?? null,
        expires_at: calcularExpiracion(),
        detalle_pedido: {
          create: detalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.subtotal,
          })),
        },
      },
      include: { detalle_pedido: true, clientes: true },
    });
    return nuevoPedido;
  });

  // Enviar WhatsApp al cliente
  const cliente = pedido.clientes;
  if (cliente.telefono) {
    const listaProductos = formatearDetalle(
      detalles.map((d) => ({ nombre: d.nombre, cantidad: d.cantidad, subtotal: d.subtotal }))
    );

    const mensaje =
      `🛒 *Pedido #${pedido.id} - Ferretería*\n\n` +
      `Hola ${cliente.nombre}, recibimos tu pedido:\n\n` +
      `${listaProductos}\n\n` +
      `💰 *Total: $${total.toFixed(2)}*\n` +
      `🚚 *Pago en efectivo al delivery*\n` +
      `📍 Entrega en: ${data.direccion_entrega}\n\n` +
      `¿Confirmas tu pedido?\n` +
      `✅ Responde *SI* para confirmar\n` +
      `❌ Responde *NO* para cancelar\n\n` +
      `⏰ Tienes ${EXPIRY_MINUTES} minutos para responder.`;

    await sendWhatsappMessage(cliente.telefono, mensaje);
  }

  return pedido;
};

// ─── Confirmar pedido (llamado desde chatbot WhatsApp) ────────────────────────

export const confirmarPedido = async (pedido_id: number) => {
  const pedido = await prisma.pedidos.findUnique({
    where: { id: pedido_id },
    include: {
      clientes: true,
      detalle_pedido: { include: { productos: true } },
    },
  });

  if (!pedido) throw new Error("Pedido no encontrado");
  if (pedido.estado !== "PENDIENTE_CONFIRMACION") {
    throw new Error(`El pedido ya está en estado: ${pedido.estado}`);
  }
  if (new Date() > pedido.expires_at) {
    await prisma.pedidos.update({ where: { id: pedido_id }, data: { estado: "CANCELADO" } });
    throw new Error("El tiempo para confirmar el pedido ha expirado");
  }

  await prisma.pedidos.update({
    where: { id: pedido_id },
    data: { estado: "CONFIRMADO", updated_at: new Date() },
  });

  // Notificar al admin
  const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER || process.env.WHATSAPP_ADMIN_PHONE;
  if (adminPhone) {
    const lista = pedido.detalle_pedido
      .map((d) => `• ${d.productos.nombre} x${d.cantidad} — $${Number(d.subtotal).toFixed(2)}`)
      .join("\n");

    const msg =
      `📦 *PEDIDO CONFIRMADO #${pedido.id}*\n\n` +
      `👤 Cliente: ${pedido.clientes.nombre}\n` +
      `📱 Teléfono: ${pedido.clientes.telefono}\n` +
      `📍 Dirección: ${pedido.direccion_entrega}\n` +
      (pedido.observaciones ? `📝 Nota: ${pedido.observaciones}\n` : "") +
      `\n${lista}\n\n` +
      `💰 *Total: $${Number(pedido.total).toFixed(2)}* (Efectivo al delivery)`;

    await sendWhatsappMessage(adminPhone, msg);
  }

  return pedido;
};

// ─── Cancelar pedido ──────────────────────────────────────────────────────────

export const cancelarPedido = async (pedido_id: number) => {
  const pedido = await prisma.pedidos.findUnique({ where: { id: pedido_id } });
  if (!pedido) throw new Error("Pedido no encontrado");

  if (pedido.estado === "ENTREGADO") {
    throw new Error("No se puede cancelar un pedido ya entregado");
  }

  return prisma.pedidos.update({
    where: { id: pedido_id },
    data: { estado: "CANCELADO", updated_at: new Date() },
  });
};

// ─── Buscar pedido pendiente por teléfono (para chatbot) ──────────────────────

export const buscarPedidoPendientePorTelefono = async (telefono: string) => {
  const cleanPhone = telefono.replace(/\D/g, "");
  return prisma.pedidos.findFirst({
    where: {
      estado: "PENDIENTE_CONFIRMACION",
      clientes: { telefono: { contains: cleanPhone } },
    },
    orderBy: { created_at: "desc" },
  });
};

// ─── Gestión admin ────────────────────────────────────────────────────────────

export const getPedidos = async (
  filters?: {
    estado?: string;
    cliente_id?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
  },
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where: any = {};
  if (filters?.estado) where.estado = filters.estado;
  if (filters?.cliente_id) where.cliente_id = filters.cliente_id;
  if (filters?.fecha_desde || filters?.fecha_hasta) {
    where.created_at = {};
    if (filters.fecha_desde) where.created_at.gte = new Date(filters.fecha_desde);
    if (filters.fecha_hasta) where.created_at.lte = new Date(filters.fecha_hasta);
  }

  const include = {
    clientes: { select: { id: true, nombre: true, telefono: true, email: true } },
    detalle_pedido: { include: { productos: { select: { id: true, nombre: true } } } },
  };

  const [total, data] = await prisma.$transaction([
    prisma.pedidos.count({ where }),
    prisma.pedidos.findMany({
      where,
      include,
      orderBy: { created_at: "desc" },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};

export const getPedidoById = async (id: number) => {
  return prisma.pedidos.findUnique({
    where: { id },
    include: {
      clientes: true,
      detalle_pedido: { include: { productos: true } },
    },
  });
};

export const actualizarEstadoPedido = async (
  id: number,
  estado: "EN_RUTA" | "ENTREGADO" | "CANCELADO"
) => {
  const pedido = await prisma.pedidos.findUnique({ where: { id } });
  if (!pedido) throw new Error("Pedido no encontrado");

  const updated = await prisma.pedidos.update({
    where: { id },
    data: { estado, updated_at: new Date() },
    include: { clientes: true },
  });

  // Notificar al cliente según el estado
  if (updated.clientes.telefono) {
    let msg = "";
    if (estado === "EN_RUTA") {
      msg =
        `🚚 *Pedido #${id} en camino*\n\n` +
        `Hola ${updated.clientes.nombre}, tu pedido ya está en ruta.\n` +
        `Recuerda tener el pago en efectivo: *$${Number(pedido.total).toFixed(2)}*\n\n` +
        `_Ferretería_`;
    } else if (estado === "ENTREGADO") {
      msg =
        `✅ *Pedido #${id} entregado*\n\n` +
        `Gracias por tu compra ${updated.clientes.nombre}. ¡Esperamos verte pronto!\n\n` +
        `_Ferretería_`;
    } else if (estado === "CANCELADO") {
      msg =
        `❌ *Pedido #${id} cancelado*\n\n` +
        `Hola ${updated.clientes.nombre}, tu pedido fue cancelado.\n` +
        `Si tienes dudas, contáctanos.\n\n` +
        `_Ferretería_`;
    }
    if (msg) await sendWhatsappMessage(updated.clientes.telefono, msg);
  }

  return updated;
};

// ─── Job: cancelar pedidos expirados ─────────────────────────────────────────

export const cancelarPedidosExpirados = async (): Promise<number> => {
  const result = await prisma.pedidos.updateMany({
    where: {
      estado: "PENDIENTE_CONFIRMACION",
      expires_at: { lt: new Date() },
    },
    data: { estado: "CANCELADO", updated_at: new Date() },
  });
  return result.count;
};
