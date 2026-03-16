import { prisma } from "../config/prisma";
import {
  CAJA_STATES,
  VENTA_STATES,
  INVENTORY_MOVEMENT_TYPES,
  BOX_MOVEMENT_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FORMATS,
  OBSERVATIONS,
} from "../constants";

export const crearVenta = async (data: any, usuario_id: number) => {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    // 🔍 Verificar caja abierta
    const cajaAbierta = await tx.caja.findFirst({
      where: {
        usuario_id,
        estado: CAJA_STATES.ABIERTA,
      },
    });

    if (!cajaAbierta) {
      throw new Error(ERROR_MESSAGES.NO_OPEN_BOX_FOR_SALE);
    }

    // 1️⃣ Validar productos y stock
    for (const item of data.productos) {
      const producto = await tx.productos.findUnique({
        where: { id: Number(item.producto_id) },
      });

      if (!producto) {
        throw new Error(`${ERROR_MESSAGES.PRODUCT_NOT_FOUND}: ${item.producto_id}`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(`${ERROR_MESSAGES.INSUFFICIENT_STOCK} para ${producto.nombre}`);
      }

      total += Number(producto.precio_venta) * Number(item.cantidad);
    }

    // 2️⃣ Crear venta
    const venta = await tx.ventas.create({
      data: {
        usuario_id,
        total,
        metodo_pago: data.metodo_pago,
      },
    });

    // 3️⃣ Crear detalles + actualizar stock + crear movimientos inventario
    for (const item of data.productos) {
      const producto = await tx.productos.findUnique({
        where: { id: Number(item.producto_id) },
      });

      const subtotal =
        Number(producto!.precio_venta) * Number(item.cantidad);

      await tx.detalle_venta.create({
        data: {
          venta_id: venta.id,
          producto_id: producto!.id,
          cantidad: item.cantidad,
          precio_unitario: producto!.precio_venta,
          subtotal,
        },
      });

      await tx.productos.update({
        where: { id: producto!.id },
        data: {
          stock: producto!.stock - item.cantidad,
        },
      });

      await tx.movimientos_inventario.create({
        data: {
          producto_id: producto!.id,
          usuario_id,
          tipo: INVENTORY_MOVEMENT_TYPES.SALIDA,
          cantidad: item.cantidad,
          referencia: `${FORMATS.SALE_REFERENCE_PREFIX}-${venta.id}`,
          observacion: OBSERVATIONS.SALE_RECORDED,
        },
      });
    }

    // 💰 Registrar ingreso en caja
    await tx.movimientos_caja.create({
      data: {
        caja_id: cajaAbierta.id,
        tipo: BOX_MOVEMENT_TYPES.INGRESO,
        monto: total,
        descripcion: `${FORMATS.SALE_DESCRIPTION_TEMPLATE}${venta.id}`,
      },
    });

    return venta;
  });
};

export const cancelarVenta = async (
  venta_id: number,
  usuario_id: number
) => {
  return prisma.$transaction(async (tx) => {
    const venta = await tx.ventas.findUnique({
      where: { id: venta_id },
    });

    if (!venta) {
      throw new Error(ERROR_MESSAGES.SALE_NOT_FOUND);
    }

    if (venta.estado === VENTA_STATES.CANCELADA) {
      throw new Error(ERROR_MESSAGES.SALE_ALREADY_CANCELLED);
    }

    // 🔍 Buscar caja abierta del usuario
    const cajaAbierta = await tx.caja.findFirst({
      where: {
        usuario_id,
        estado: CAJA_STATES.ABIERTA,
      },
    });

    if (!cajaAbierta) {
      throw new Error(ERROR_MESSAGES.NO_OPEN_BOX_TO_CANCEL);
    }

    const detalles = await tx.detalle_venta.findMany({
      where: { venta_id },
    });

    // 🔄 Revertir stock y crear movimientos inventario
    for (const item of detalles) {
      const producto = await tx.productos.findUnique({
        where: { id: item.producto_id },
      });

      if (!producto) continue;

      await tx.productos.update({
        where: { id: producto.id },
        data: {
          stock: producto.stock + item.cantidad,
        },
      });

      await tx.movimientos_inventario.create({
        data: {
          producto_id: producto.id,
          usuario_id,
          tipo: INVENTORY_MOVEMENT_TYPES.ENTRADA,
          cantidad: item.cantidad,
          referencia: `${OBSERVATIONS.CANCELLATION_PREFIX}-${venta.id}`,
          observacion: OBSERVATIONS.SALE_CANCELLED,
        },
      });
    }

    // 💸 Registrar egreso en caja (devolver dinero)
    await tx.movimientos_caja.create({
      data: {
        caja_id: cajaAbierta.id,
        tipo: BOX_MOVEMENT_TYPES.EGRESO,
        monto: venta.total,
        descripcion: `Cancelación venta #${venta.id}`,
      },
    });

    // Cambiar estado
    await tx.ventas.update({
      where: { id: venta_id },
      data: { estado: VENTA_STATES.CANCELADA },
    });

    return { message: SUCCESS_MESSAGES.SALE_CANCELLED };
  });
};