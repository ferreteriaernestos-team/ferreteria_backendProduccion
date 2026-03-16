/**
 * DTOs para autenticación
 */

export class RegisterRequestDTO {
  nombre!: string;
  email!: string;
  password!: string;
  rol_id!: number;
}

export class LoginRequestDTO {
  email!: string;
  password!: string;
}

export class AuthResponseDTO {
  token!: string;
}

export class UserResponseDTO {
  id!: number;
  nombre!: string;
  email!: string;
  rol_id!: number;
  created_at?: Date;
}

export class RegisterResponseDTO extends UserResponseDTO {}
