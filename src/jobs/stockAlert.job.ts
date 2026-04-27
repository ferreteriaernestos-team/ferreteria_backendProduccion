import cron from "node-cron";
import { prisma } from "../config/prisma";
import {
  sendWhatsappMessage,
  formatStockAlertMessage,
} from "../services/whatsapp.service";

export const iniciarJobAlertasStock = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("\n⏰ [Stock Alert Job] Verificando stock bajo...");
    await verificarYEnviarAlertas();
  });

  console.log("✅ [Stock Alert Job] Configurado (cada 5 minutos)");
};

async function verificarYEnviarAlertas() {
  try {
    // Resetear alerta de productos cuyo stock ya volvió a la normalidad
    const productosConAlerta = await prisma.productos.findMany({
      where: { activo: true, alerta_enviada: true },
      select: { id: true, stock: true, stock_minimo: true },
    });

    for (const producto of productosConAlerta) {
      if (producto.stock > producto.stock_minimo) {
        await prisma.productos.update({
          where: { id: producto.id },
          data: { alerta_enviada: false },
        });
        console.log(
          `🔄 Alerta reseteada - Producto ID ${producto.id}: stock ${producto.stock} > mínimo ${producto.stock_minimo}`
        );
      }
    }

    // Obtener todos los activos sin alerta enviada y filtrar por stock bajo en JS
    // (Prisma no permite comparar dos columnas en el mismo where sin SQL raw)
    const productosActivos = await prisma.productos.findMany({
      where: { activo: true, alerta_enviada: false },
      include: {
        proveedores: {
          select: { id: true, nombre: true, telefono: true },
        },
      },
    });

    const productosBajos = productosActivos.filter(
      (p) => p.stock <= p.stock_minimo
    );

    console.log(
      `📦 Productos con stock bajo: ${productosBajos.length}`
    );

    if (productosBajos.length === 0) {
      console.log("✅ Sin productos en stock bajo por ahora");
      return;
    }

    for (const producto of productosBajos) {
      await procesarProductoBajo(producto);
    }
  } catch (error) {
    console.error("❌ Error en job de alertas de stock:", error);
  }
}

async function procesarProductoBajo(producto: any) {
  try {
    if (!producto.proveedor_id || !producto.proveedores) {
      console.warn(
        `⚠️ "${producto.nombre}" (ID: ${producto.id}) sin proveedor asignado`
      );
      return;
    }

    const proveedor = producto.proveedores;

    if (!proveedor.telefono) {
      console.warn(`⚠️ Proveedor "${proveedor.nombre}" sin teléfono registrado`);
      return;
    }

    const mensaje = formatStockAlertMessage(
      producto.nombre,
      producto.stock,
      producto.stock_minimo,
      proveedor.nombre
    );

    console.log(
      `📱 Enviando alerta de "${producto.nombre}" a ${proveedor.telefono}...`
    );

    const enviado = await sendWhatsappMessage(proveedor.telefono, mensaje);

    if (enviado) {
      await prisma.productos.update({
        where: { id: producto.id },
        data: { alerta_enviada: true, updated_at: new Date() },
      });
      console.log(
        `✅ Alerta enviada - "${producto.nombre}" → ${proveedor.nombre}`
      );
    } else {
      console.error(
        `❌ Falló el envío para "${producto.nombre}" a ${proveedor.telefono}`
      );
    }
  } catch (error) {
    console.error(`❌ Error procesando "${producto.nombre}":`, error);
  }
}

export const resetearTodasLasAlertas = async () => {
  try {
    const resultado = await prisma.productos.updateMany({
      where: { alerta_enviada: true },
      data: { alerta_enviada: false },
    });
    console.log(`🔄 Alertas reseteadas: ${resultado.count} productos`);
    return resultado;
  } catch (error) {
    console.error("❌ Error reseteando alertas:", error);
  }
};
