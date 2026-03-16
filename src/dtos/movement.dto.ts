/**
 * DTOs para movimientos de inventario
 */

export class CreateMovementRequestDTO {
  producto_id!: number;
  cantidad!: number;
  tipo!: string; // ENTRADA, SALIDA, AJUSTE
  referencia?: string;
  observacion?: string;
}

export class MovementResponseDTO {
  id!: number;
  producto_id!: number;
  usuario_id!: number;
  tipo!: string;
  cantidad!: number;
  referencia?: string;
  observacion?: string;
  created_at?: Date;
}

export class MovementWithProductDTO extends MovementResponseDTO {
  producto?: {
    id: number;
    nombre: string;
    stock: number;
  };
}

export class MovementListResponseDTO {
  movimientos!: MovementWithProductDTO[];
  total!: number;
}

export class CreateMovementResponseDTO {
  success!: boolean;
  message!: string;
  data!: MovementResponseDTO;
}
