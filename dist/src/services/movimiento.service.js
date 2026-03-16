"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarMovimientos = exports.crearMovimiento = void 0;
const prisma_1 = require("../config/prisma");
const constants_1 = require("../constants");
const crearMovimiento = async (data, usuario_id) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        const producto = await tx.productos.findUnique({
            where: { id: Number(data.producto_id) },
        });
        if (!producto) {
            throw new Error(constants_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
        const cantidad = Number(data.cantidad);
        if (cantidad <= 0) {
            throw new Error(constants_1.ERROR_MESSAGES.INVALID_QUANTITY);
        }
        let nuevoStock = producto.stock;
        if (data.tipo === constants_1.INVENTORY_MOVEMENT_TYPES.ENTRADA) {
            nuevoStock += cantidad;
        }
        if (data.tipo === constants_1.INVENTORY_MOVEMENT_TYPES.SALIDA) {
            if (producto.stock < cantidad) {
                throw new Error(constants_1.ERROR_MESSAGES.INSUFFICIENT_STOCK);
            }
            nuevoStock -= cantidad;
        }
        if (data.tipo === constants_1.INVENTORY_MOVEMENT_TYPES.AJUSTE) {
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
exports.crearMovimiento = crearMovimiento;
const listarMovimientos = async () => {
    const movimientos = await prisma_1.prisma.movimientos_inventario.findMany({
        orderBy: { created_at: constants_1.DATABASE.ORDER_BY_DESC },
    });
    console.log(constants_1.LOG_MESSAGES.MOVEMENTS_FOUND, movimientos);
    return movimientos;
};
exports.listarMovimientos = listarMovimientos;
