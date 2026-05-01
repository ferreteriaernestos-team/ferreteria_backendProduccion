import { prisma } from "../config/prisma";
import {
  INVENTORY_MOVEMENT_TYPES,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  DATABASE,
} from "../constants";

export const crearMovimiento = async (
  data: any,
  usuario_id: number
) => {
  return prisma.$transaction(async (tx) => {
    const producto = await tx.productos.findUnique({
      where: { id: Number(data.producto_id) },
    });

    if (!producto) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const cantidad = Number(data.cantidad);

    if (cantidad <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }

    let nuevoStock = producto.stock;

    if (data.tipo === INVENTORY_MOVEMENT_TYPES.ENTRADA) {
      nuevoStock += cantidad;
    }

    if (data.tipo === INVENTORY_MOVEMENT_TYPES.SALIDA) {
      if (producto.stock < cantidad) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
      }
      nuevoStock -= cantidad;
    }

    if (data.tipo === INVENTORY_MOVEMENT_TYPES.AJUSTE) {
      nuevoStock = cantidad;
    }

    await tx.productos.update({
      where: { id: producto.id },
      data: { stock: nuevoStock },
    });

    const movimiento = await tx.movimientos_inventario.create({
      data: {
        producto_id: producto.id,
        usuario_id,
        tipo: data.tipo,
        cantidad,
        referencia: data.referencia,
        observacion: data.observacion,
      },
    });

    return movimiento;
  });
};

export const listarMovimientos = async () => {
  const movimientos = await prisma.movimientos_inventario.findMany({
    orderBy: { created_at: DATABASE.ORDER_BY_DESC },
    include: {
      productos: {
        select: { nombre: true },
      },
    },
  });

  console.log(LOG_MESSAGES.MOVEMENTS_FOUND, movimientos);

  return movimientos;
};