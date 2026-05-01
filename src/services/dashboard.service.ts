import { prisma } from "../config/prisma";

export const getDashboardData = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  // Ventas del día
  const ventasHoy = await prisma.ventas.aggregate({
    _sum: {
      total: true
    },
    _count: true,
    where: {
      created_at: {
        gte: hoy
      },
      estado: "COMPLETADA"
    }
  });

  // Ventas del mes
  const ventasMes = await prisma.ventas.aggregate({
    _sum: {
      total: true
    },
    where: {
      created_at: {
        gte: inicioMes
      },
      estado: "COMPLETADA"
    }
  });

  // Productos bajo stock (comparación columna-a-columna)
  const todosProductos = await prisma.productos.findMany({
    where: { activo: true },
    select: { stock: true, stock_minimo: true },
  });
  const productosBajoStock = todosProductos.filter(
    (p) => p.stock <= p.stock_minimo
  ).length;

  // Caja abierta
  const cajaAbierta = await prisma.caja.findFirst({
    where: {
      estado: "ABIERTA"
    }
  });

  return {
    ventas_hoy: ventasHoy._sum.total || 0,
    ventas_realizadas_hoy: ventasHoy._count,
    ventas_mes: ventasMes._sum.total || 0,
    productos_bajo_stock: productosBajoStock,
    caja_abierta: !!cajaAbierta
  };
};