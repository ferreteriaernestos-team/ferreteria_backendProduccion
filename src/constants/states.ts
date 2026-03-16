/**
 * Estados de Caja
 */
export const CAJA_STATES = {
  ABIERTA: "ABIERTA",
  CERRADA: "CERRADA",
} as const;

/**
 * Estados de Venta
 */
export const VENTA_STATES = {
  COMPLETADA: "COMPLETADA",
  CANCELADA: "CANCELADA",
} as const;

/**
 * Tipos generales de estado
 */
export type CajaState = typeof CAJA_STATES[keyof typeof CAJA_STATES];
export type VentaState = typeof VENTA_STATES[keyof typeof VENTA_STATES];
