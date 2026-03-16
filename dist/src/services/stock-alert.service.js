"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarStockCritico = void 0;
const prisma_1 = require("../config/prisma");
const llm_service_1 = require("./llm.service");
const whatsapp_service_1 = require("./whatsapp.service");
const verificarStockCritico = async () => {
    const productos = await prisma_1.prisma.productos.findMany({
        where: { activo: true },
    });
    const productosCriticos = [];
    const productosRiesgo = [];
    for (const producto of productos) {
        const consumoPromedio = await calcularConsumoPromedio(producto.id);
        if (consumoPromedio === 0)
            continue;
        const diasRestantes = producto.stock / consumoPromedio;
        const esCritico = producto.stock <= producto.stock_minimo || diasRestantes < 7;
        const esRiesgo = diasRestantes < 15;
        if (esCritico) {
            productosCriticos.push({
                ...producto,
                diasRestantes,
                consumoPromedio,
            });
        }
        else if (esRiesgo) {
            productosRiesgo.push({
                ...producto,
                diasRestantes,
                consumoPromedio,
            });
        }
    }
    // 🔥 Enviar alertas individuales críticas
    for (const producto of productosCriticos) {
        const mensaje = await (0, llm_service_1.generarMensajeStockCritico)({
            nombre: producto.nombre,
            stock: producto.stock,
            stock_minimo: producto.stock_minimo,
            dias_restantes: producto.diasRestantes.toFixed(1),
            cantidad_sugerida: Math.ceil(producto.consumoPromedio * 30) - producto.stock,
        });
        await (0, whatsapp_service_1.enviarWhatsApp)(mensaje);
    }
    // 🔥 Generar resumen diario
    const resumenMensaje = generarResumenDiario(productosCriticos, productosRiesgo);
    await (0, whatsapp_service_1.enviarWhatsApp)(resumenMensaje);
};
exports.verificarStockCritico = verificarStockCritico;
const calcularConsumoPromedio = async (producto_id) => {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    const ventas = await prisma_1.prisma.detalle_venta.findMany({
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
    const totalVendido = ventas.reduce((acc, v) => acc + v.cantidad, 0);
    return totalVendido / 30;
};
const generarResumenDiario = (criticos, riesgo) => {
    return `
📊 RESUMEN DIARIO DE INVENTARIO

🔴 Productos críticos: ${criticos.length}
🟠 Productos en riesgo: ${riesgo.length}

${criticos.length === 0
        ? "✅ No hay productos críticos actualmente."
        : "⚠️ Se recomienda revisar los productos críticos lo antes posible."}
`;
};
