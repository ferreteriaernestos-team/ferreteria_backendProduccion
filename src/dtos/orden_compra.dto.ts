/**
 * DTOs para órdenes de compra
 */

export class CreateOrdenCompraDTO {
  proveedor_id!: number;
  productos!: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export class OrdenCompraResponseDTO {
  id!: number;
  proveedor_id!: number;
  usuario_id!: number;
  total!: number;
  estado!: string;
  created_at!: Date;
}

export class OrdenCompraDetalleDTO {
  producto_id!: number;
  cantidad!: number;
  precio_unitario!: number;
  subtotal!: number;
}

export class OrdenCompraCompletaDTO {
  orden!: OrdenCompraResponseDTO;
  detalles!: OrdenCompraDetalleDTO[];
}