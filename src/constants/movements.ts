/**
 * Tipos de Movimiento de Inventario
 */
export const INVENTORY_MOVEMENT_TYPES = {
  ENTRADA: "ENTRADA",
  SALIDA: "SALIDA",
  AJUSTE: "AJUSTE",
} as const;

/**
 * Tipos de Movimiento de Caja
 */
export const BOX_MOVEMENT_TYPES = {
  INGRESO: "INGRESO",
  EGRESO: "EGRESO",
} as const;

/**
 * Tipos de movimiento
 */
export type InventoryMovementType =
  typeof INVENTORY_MOVEMENT_TYPES[keyof typeof INVENTORY_MOVEMENT_TYPES];
export type BoxMovementType =
  typeof BOX_MOVEMENT_TYPES[keyof typeof BOX_MOVEMENT_TYPES];
