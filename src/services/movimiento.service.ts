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

export const listarMovimientos = async (
  filters?: { tipo?: string; producto_id?: number },
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where = {
    ...(filters?.tipo && { tipo: filters.tipo as any }),
    ...(filters?.producto_id && { producto_id: filters.producto_id }),
  };

  const [total, data] = await prisma.$transaction([
    prisma.movimientos_inventario.count({ where }),
    prisma.movimientos_inventario.findMany({
      where,
      orderBy: { created_at: DATABASE.ORDER_BY_DESC },
      include: { productos: { select: { nombre: true } } },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};