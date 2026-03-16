/**
 * DTOs para inventario
 */

export class ProductoInventarioDTO {
  id!: number
  nombre!: string
  stock!: number
  stock_minimo!: number
  proveedor?: string | null
}

export class ProductosCriticosResponseDTO {
  productos!: ProductoInventarioDTO[]
  total!: number
}