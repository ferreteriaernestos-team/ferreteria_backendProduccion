import { prisma } from "../config/prisma";
import { BOX_MOVEMENT_TYPES, VENTA_STATES, ERROR_MESSAGES } from "../constants";

export const reporteCajaPorId = async (caja_id: number) => {
  const caja = await prisma.caja.findUnique({
    where: { id: caja_id },
  });

  if (!caja) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  const movimientos = await prisma.movimientos_caja.findMany({
    where: { caja_id },
  });

  const ingresos = movimientos
    .filter((m) => m.tipo === BOX_MOVEMENT_TYPES.INGRESO)
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const egresos = movimientos
    .filter((m) => m.tipo === BOX_MOVEMENT_TYPES.EGRESO)
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const ventas = await prisma.ventas.count({
    where: {
      usuario_id: caja.usuario_id,
      created_at: {
        gte: caja.fecha_apertura,
        lte: caja.fecha_cierre || new Date(),
      },
      estado: VENTA_STATES.COMPLETADA,
    },
  });

  const monto_final_calculado =
    Number(caja.monto_inicial) + ingresos - egresos;

  return {
    caja,
    ingresos,
    egresos,
    ventas,
    monto_final_calculado,
  };
};

export const reporteDiario = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ventas = await prisma.ventas.findMany({
    where: {
      created_at: {
        gte: hoy,
      },
      estado: VENTA_STATES.COMPLETADA,
    },
    include: {
      detalle_venta: true,
    },
  });

  const totalVentas = ventas.reduce(
    (acc, v) => acc + Number(v.total),
    0
  );

  const productosVendidos: Record<number, number> = {};

  ventas.forEach((venta) => {
    venta.detalle_venta.forEach((d) => {
      productosVendidos[d.producto_id] =
        (productosVendidos[d.producto_id] || 0) + d.cantidad;
    });
  });

  return {
    totalVentas,
    cantidadVentas: ventas.length,
    productosVendidos,
  };
};

export const reporteMensual = async () => {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const ventas = await prisma.ventas.findMany({
    where: {
      created_at: {
        gte: inicioMes,
      },
      estado: VENTA_STATES.COMPLETADA,
    },
  });

  const totalIngresos = ventas.reduce(
    (acc, v) => acc + Number(v.total),
    0
  );

  return {
    totalVentas: ventas.length,
    totalIngresos,
  };
};
export const reporteTopProductos = async () => {

  const resultados = await prisma.detalle_venta.groupBy({
    by: ["producto_id"],
    _sum: {
      cantidad: true,
    },
    orderBy: {
      _sum: {
        cantidad: "desc",
      },
    },
    take: 5,
  });

  const productos = await Promise.all(
    resultados.map(async (r) => {

      const producto = await prisma.productos.findUnique({
        where: { id: r.producto_id },
        select: { nombre: true },
      });

      return {
        producto: producto?.nombre || "Producto desconocido",
        ventas: r._sum.cantidad || 0,
      };

    })
  );

  return productos;
};