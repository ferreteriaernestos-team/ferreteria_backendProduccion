/**
 * DTOs para ventas
 */

export class SaleDetailItemDTO {
  producto_id!: number;
  cantidad!: number;
}

export class CreateSaleRequestDTO {
  productos!: SaleDetailItemDTO[];
  metodo_pago!: string;
}

export class SaleDetailResponseDTO {
  id!: number;
  venta_id!: number;
  producto_id!: number;
  cantidad!: number;
  precio_unitario!: number | string;
  subtotal!: number | string;
}

export class SaleResponseDTO {
  id!: number;
  usuario_id!: number;
  total!: number | string;
  metodo_pago!: string;
  estado?: string | null;
  created_at?: Date | null;
  detalle_venta?: SaleDetailResponseDTO[];
}

export class CancelSaleRequestDTO {
  venta_id!: number;
}

export class CancelSaleResponseDTO {
  success!: boolean;
  message!: string;
  data?: any;
}

export class SaleListResponseDTO {
  ventas!: SaleResponseDTO[];
  total?: number;
}
