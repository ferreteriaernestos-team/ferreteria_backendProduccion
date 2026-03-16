/**
 * Valores por defecto
 */
export const DEFAULTS = {
  // Producto
  PRODUCT_INITIAL_STOCK: 0,
  PRODUCT_MINIMUM_STOCK: 5,

  // Auth
  BCRYPT_SALT_ROUNDS: 10,
  JWT_EXPIRATION: "8h",

  // API
  MORGAN_FORMAT: "dev",
} as const;

/**
 * Valores de configuración de rutas
 */
export const ROUTE_PATHS = {
  AUTH: "/api/auth",
  PRODUCTS: "/api/products",
  MOVEMENTS: "/api/movimientos",
  SALES: "/api/ventas",
  BOX: "/api/caja",
  REPORTS: "/api/reportes",
} as const;

/**
 * Prefijos y formatos
 */
export const FORMATS = {
  BEARER_PREFIX: "Bearer ",
  SALE_REFERENCE_PREFIX: "VENTA",
  SALE_DESCRIPTION_TEMPLATE: "Venta #",
} as const;

/**
 * Campos de base de datos
 */
export const DATABASE = {
  ORDER_BY_DESC: "desc",
  ORDER_BY_ASC: "asc",
} as const;

/**
 * Observaciones y notas para el sistema
 */
export const OBSERVATIONS = {
  SALE_RECORDED: "Venta registrada en sistema",
  SALE_CANCELLED: "Cancelación de venta",
  MONEY_REFUND: "Devolución de dinero",
  CANCELLATION_PREFIX: "CANCELACION",
} as const;
