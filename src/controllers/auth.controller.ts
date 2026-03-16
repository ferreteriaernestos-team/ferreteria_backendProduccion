import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  AuthResponseDTO,
  UserResponseDTO,
  RegisterResponseDTO,
} from "../dtos";

export const register = async (req: Request, res: Response) => {
  try {
    const registerData: RegisterRequestDTO = req.body;
    const user = await registerUser(registerData);
    
    const userResponse: RegisterResponseDTO = {
      id: (user as any).id,
      nombre: (user as any).nombre,
      email: (user as any).email,
      rol_id: (user as any).rol_id,
    };

    res.status(201).json(userResponse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginData: LoginRequestDTO = req.body;
    const result = await loginUser(loginData.email, loginData.password);
    
    const authResponse: AuthResponseDTO = {
      token: result.token,
    };

    res.json(authResponse);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};