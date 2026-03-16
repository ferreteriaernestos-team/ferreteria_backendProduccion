/**
 * DTOs para productos
 */

export class CreateProductRequestDTO {
  nombre!: string;
  descripcion?: string;
  codigo?: string;
  precio_compra!: number | string;
  precio_venta!: number | string;
  stock?: number;
  stock_minimo?: number;
  proveedor_id?: number;
}

export class UpdateProductRequestDTO {
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  precio_compra?: number | string;
  precio_venta?: number | string;
  stock?: number;
  stock_minimo?: number;
  proveedor_id?: number;
  activo?: boolean;
}

export class ProductResponseDTO {
  id!: number;
  nombre!: string;
  descripcion?: string | null;
  codigo?: string | null;
  precio_compra!: number | string;
  precio_venta!: number | string;
  stock!: number;
  stock_minimo!: number;
  proveedor_id?: number | null;
  activo?: boolean | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export class ProductListResponseDTO {
  productos!: any[];
  total?: number;
}

