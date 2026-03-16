"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBSERVATIONS = exports.DATABASE = exports.FORMATS = exports.ROUTE_PATHS = exports.DEFAULTS = void 0;
/**
 * Valores por defecto
 */
exports.DEFAULTS = {
    // Producto
    PRODUCT_INITIAL_STOCK: 0,
    PRODUCT_MINIMUM_STOCK: 5,
    // Auth
    BCRYPT_SALT_ROUNDS: 10,
    JWT_EXPIRATION: "8h",
    // API
    MORGAN_FORMAT: "dev",
};
/**
 * Valores de configuración de rutas
 */
exports.ROUTE_PATHS = {
    AUTH: "/api/auth",
    PRODUCTS: "/api/products",
    MOVEMENTS: "/api/movimientos",
    SALES: "/api/ventas",
    BOX: "/api/caja",
    REPORTS: "/api/reportes",
};
/**
 * Prefijos y formatos
 */
exports.FORMATS = {
    BEARER_PREFIX: "Bearer ",
    SALE_REFERENCE_PREFIX: "VENTA",
    SALE_DESCRIPTION_TEMPLATE: "Venta #",
};
/**
 * Campos de base de datos
 */
exports.DATABASE = {
    ORDER_BY_DESC: "desc",
    ORDER_BY_ASC: "asc",
};
/**
 * Observaciones y notas para el sistema
 */
exports.OBSERVATIONS = {
    SALE_RECORDED: "Venta registrada en sistema",
    SALE_CANCELLED: "Cancelación de venta",
    MONEY_REFUND: "Devolución de dinero",
    CANCELLATION_PREFIX: "CANCELACION",
};
