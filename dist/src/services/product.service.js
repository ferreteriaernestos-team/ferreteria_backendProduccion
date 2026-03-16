"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const prisma_1 = require("../config/prisma");
const constants_1 = require("../constants");
const getAllProducts = async () => {
    return prisma_1.prisma.productos.findMany();
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return prisma_1.prisma.productos.findUnique({
        where: { id },
    });
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    return prisma_1.prisma.productos.create({
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            codigo: data.codigo,
            precio_compra: data.precio_compra,
            precio_venta: data.precio_venta,
            stock: data.stock ?? constants_1.DEFAULTS.PRODUCT_INITIAL_STOCK,
            stock_minimo: data.stock_minimo ?? constants_1.DEFAULTS.PRODUCT_MINIMUM_STOCK,
            proveedor_id: data.proveedor_id,
            activo: true,
        },
    });
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    return prisma_1.prisma.productos.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return prisma_1.prisma.productos.update({
        where: { id },
        data: { activo: false }, // 🔥 borrado lógico
    });
};
exports.deleteProduct = deleteProduct;
