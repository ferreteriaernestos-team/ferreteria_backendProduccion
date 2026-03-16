import { prisma } from "../config/prisma";
import { generarMensajeStockCritico } from "./llm.service";
import { enviarWhatsApp } from "./whatsapp.service";

export const verificarStockCritico = async () => {
  const productos = await prisma.productos.findMany({
    where: { activo: true },
  });

  const productosCriticos: any[] = [];
  const productosRiesgo: any[] = [];

  for (const producto of productos) {
    const consumoPromedio = await calcularConsumoPromedio(producto.id);
    if (consumoPromedio === 0) continue;

    const diasRestantes = producto.stock / consumoPromedio;

    const esCritico =
      producto.stock <= producto.stock_minimo || diasRestantes < 7;

    const esRiesgo = diasRestantes < 15;

    if (esCritico) {
      productosCriticos.push({
        ...producto,
        diasRestantes,
        consumoPromedio,
      });
    } else if (esRiesgo) {
      productosRiesgo.push({
        ...producto,
        diasRestantes,
        consumoPromedio,
      });
    }
  }

  // 🔥 Enviar alertas individuales críticas
  for (const producto of productosCriticos) {
    const mensaje = await generarMensajeStockCritico({
      nombre: producto.nombre,
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      dias_restantes: producto.diasRestantes.toFixed(1),
      cantidad_sugerida:
        Math.ceil(producto.consumoPromedio * 30) - producto.stock,
    });

    await enviarWhatsApp(mensaje);
  }

  // 🔥 Generar resumen diario
  const resumenMensaje = generarResumenDiario(
    productosCriticos,
    productosRiesgo
  );

  await enviarWhatsApp(resumenMensaje);
};

const calcularConsumoPromedio = async (producto_id: number) => {
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  const ventas = await prisma.detalle_venta.findMany({
    where: {
      producto_id,
      ventas: {
        created_at: { gte: hace30Dias },
      },
    },
    include: {
      ventas: true,
    },
  });

  const totalVendido = ventas.reduce(
    (acc, v) => acc + v.cantidad,
    0
  );

  return totalVendido / 30;
};

const generarResumenDiario = (
  criticos: any[],
  riesgo: any[]
) => {
  return `
📊 RESUMEN DIARIO DE INVENTARIO

🔴 Productos críticos: ${criticos.length}
🟠 Productos en riesgo: ${riesgo.length}

${
  criticos.length === 0
    ? "✅ No hay productos críticos actualmente."
    : "⚠️ Se recomienda revisar los productos críticos lo antes posible."
}
`;
};