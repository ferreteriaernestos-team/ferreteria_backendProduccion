"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cerrarCaja = exports.abrirCaja = void 0;
const prisma_1 = require("../config/prisma");
const constants_1 = require("../constants");
const abrirCaja = async (usuario_id, monto_inicial) => {
    const cajaAbierta = await prisma_1.prisma.caja.findFirst({
        where: {
            usuario_id,
            estado: constants_1.CAJA_STATES.ABIERTA,
        },
    });
    if (cajaAbierta) {
        throw new Error(constants_1.ERROR_MESSAGES.BOX_ALREADY_OPEN);
    }
    return prisma_1.prisma.caja.create({
        data: {
            usuario_id,
            fecha_apertura: new Date(),
            monto_inicial,
        },
    });
};
exports.abrirCaja = abrirCaja;
const cerrarCaja = async (usuario_id) => {
    const cajaAbierta = await prisma_1.prisma.caja.findFirst({
        where: {
            usuario_id,
            estado: constants_1.CAJA_STATES.ABIERTA,
        },
    });
    if (!cajaAbierta) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_OPEN_BOX);
    }
    const movimientos = await prisma_1.prisma.movimientos_caja.findMany({
        where: { caja_id: cajaAbierta.id },
    });
    const totalMovimientos = movimientos.reduce((acc, mov) => mov.tipo === constants_1.BOX_MOVEMENT_TYPES.INGRESO
        ? acc + Number(mov.monto)
        : acc - Number(mov.monto), 0);
    const monto_final = Number(cajaAbierta.monto_inicial) + totalMovimientos;
    return prisma_1.prisma.caja.update({
        where: { id: cajaAbierta.id },
        data: {
            estado: constants_1.CAJA_STATES.CERRADA,
            fecha_cierre: new Date(),
            monto_final,
        },
    });
};
exports.cerrarCaja = cerrarCaja;
