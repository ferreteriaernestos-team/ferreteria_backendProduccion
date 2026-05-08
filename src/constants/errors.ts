/**
 * Mensajes de Error
 */
export const ERROR_MESSAGES = {
  // Auth errors
  USER_ALREADY_EXISTS: "El usuario ya existe",
  USER_NOT_FOUND: "Usuario no encontrado",
  INVALID_CREDENTIALS: "Credenciales inválidas",

  // Token errors
  TOKEN_REQUIRED: "Token requerido",
  INVALID_TOKEN_FORMAT: "Formato de token inválido",
  INVALID_OR_EXPIRED_TOKEN: "Token inválido o expirado",

  // Auth errors
  USER_NOT_AUTHENTICATED: "Usuario no autenticado",
  INSUFFICIENT_PERMISSIONS: "Acceso denegado. No tienes permisos suficientes.",

  // Product errors
  PRODUCT_NOT_FOUND: "Producto no encontrado",
  INSUFFICIENT_STOCK: "Stock insuficiente",

  // Caja errors
  BOX_ALREADY_OPEN: "Ya existe una caja abierta",
  NO_OPEN_BOX: "No hay caja abierta",
  NO_OPEN_BOX_FOR_SALE: "No hay caja abierta para este usuario",
  NO_OPEN_BOX_TO_CANCEL: "No hay caja abierta para cancelar la venta",

  // Venta errors
  SALE_NOT_FOUND: "Venta no encontrada",
  SALE_ALREADY_CANCELLED: "La venta ya está cancelada",

  // Inventory errors
  INVALID_QUANTITY: "Cantidad inválida",
  INVALID_ID: "ID inválido",
  
  // Categoria errors
  CATEGORY_NOT_FOUND: "Categoría no encontrada",

  // Cliente errors
  CLIENT_NOT_FOUND: "Cliente no encontrado",

  // Descuento errors
  DISCOUNT_NOT_FOUND: "Descuento no encontrado",

  // General errors
  ERROR_REGISTERING_MOVEMENT: "Error al registrar movimiento",
  ERROR_FETCHING_MOVEMENTS: "Error al obtener movimientos",
} as const;

/**
 * Mensajes de Éxito
 */
export const SUCCESS_MESSAGES = {
  PRODUCT_DELETED: "Producto eliminado correctamente",
  BOX_OPENED: "Caja abierta correctamente",
  BOX_CLOSED: "Caja cerrada correctamente",
  SALE_CREATED: "Venta registrada correctamente",
  SALE_CANCELLED: "Venta cancelada correctamente",
  MOVEMENT_CREATED: "Movimiento registrado correctamente",
  MOVEMENTS_FETCHED: "Movimientos obtenidos correctamente",
} as const;

/**
 * Mensajes de Log / Debug
 */
export const LOG_MESSAGES = {
  USER_FROM_TOKEN: "USER DESDE TOKEN:",
  USER_ROLE: "ROL DEL USUARIO:",
  ALLOWED_ROLES: "ROLES PERMITIDOS:",
  MOVEMENTS_FOUND: "MOVIMIENTOS ENCONTRADOS:",
  ERROR_CREATING_SALE: "Error al crear venta:",
  ERROR_CANCELLING_SALE: "Error al cancelar venta:",
  ERROR_CREATING_MOVEMENT: "Error al crear movimiento:",
  ERROR_LISTING_MOVEMENTS: "Error al listar movimientos:",
} as const;
