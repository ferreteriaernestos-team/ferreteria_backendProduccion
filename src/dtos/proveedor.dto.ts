/**
 * DTOs para proveedores
 */

export class CreateProveedorDTO {
  nombre!: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export class UpdateProveedorDTO {
  nombre?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export class ProveedorDTO {
  id!: number;
  nombre!: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  created_at!: Date;
}

export class ProveedoresListDTO {
  proveedores!: ProveedorDTO[];
  total!: number;
}