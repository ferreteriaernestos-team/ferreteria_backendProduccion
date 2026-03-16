"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteMensual = exports.reporteDiario = exports.reporteCajaPorId = void 0;
const prisma_1 = require("../config/prisma");
const constants_1 = require("../constants");
const reporteCajaPorId = async (caja_id) => {
    const caja = await prisma_1.prisma.caja.findUnique({
        where: { id: caja_id },
    });
    if (!caja) {
        throw new Error(constants_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    const movimientos = await prisma_1.prisma.movimientos_caja.findMany({
        where: { caja_id },
    });
    const ingresos = movimientos
        .filter((m) => m.tipo === constants_1.BOX_MOVEMENT_TYPES.INGRESO)
        .reduce((acc, m) => acc + Number(m.monto), 0);
    const egresos = movimientos
        .filter((m) => m.tipo === constants_1.BOX_MOVEMENT_TYPES.EGRESO)
        .reduce((acc, m) => acc + Number(m.monto), 0);
    const ventas = await prisma_1.prisma.ventas.count({
        where: {
            usuario_id: caja.usuario_id,
            created_at: {
                gte: caja.fecha_apertura,
                lte: caja.fecha_cierre || new Date(),
            },
            estado: constants_1.VENTA_STATES.COMPLETADA,
        },
    });
    const monto_final_calculado = Number(caja.monto_inicial) + ingresos - egresos;
    return {
        caja,
        ingresos,
        egresos,
        ventas,
        monto_final_calculado,
    };
};
exports.reporteCajaPorId = reporteCajaPorId;
const reporteDiario = async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ventas = await prisma_1.prisma.ventas.findMany({
        where: {
            created_at: {
                gte: hoy,
            },
            estado: constants_1.VENTA_STATES.COMPLETADA,
        },
        include: {
            detalle_venta: true,
        },
    });
    const totalVentas = ventas.reduce((acc, v) => acc + Number(v.total), 0);
    const productosVendidos = {};
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
exports.reporteDiario = reporteDiario;
const reporteMensual = async () => {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    const ventas = await prisma_1.prisma.ventas.findMany({
        where: {
            created_at: {
                gte: inicioMes,
            },
            estado: constants_1.VENTA_STATES.COMPLETADA,
        },
    });
    const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.total), 0);
    return {
        totalVentas: ventas.length,
        totalIngresos,
    };
};
exports.reporteMensual = reporteMensual;
