/**
 * DTOs para caja (Cash Register)
 */

export class OpenBoxRequestDTO {
  monto_inicial!: number | string;
}

export class BoxMovementDTO {
  id!: number;
  caja_id!: number;
  tipo!: string;
  monto!: number | string;
  descripcion?: string | null;
  created_at?: Date | null;
}

export class BoxResponseDTO {
  id!: number;
  usuario_id!: number;
  fecha_apertura!: Date;
  monto_inicial!: number | string;
  fecha_cierre?: Date | null;
  monto_final?: number | string | null;
  estado?: string | null;
}

export class BoxDetailResponseDTO {
  caja!: Omit<BoxResponseDTO, 'monto_inicial' | 'monto_final'> & {
    monto_inicial: number | string;
    monto_final?: number | string | null;
  };
  ingresos!: number;
  egresos!: number;
  ventas!: number;
  monto_final_calculado!: number;
  movimientos?: BoxMovementDTO[];
}

export class CloseBoxResponseDTO {
  success!: boolean;
  message!: string;
  data!: any;
}

export class OpenBoxResponseDTO {
  success!: boolean;
  message!: string;
  data!: any;
}
