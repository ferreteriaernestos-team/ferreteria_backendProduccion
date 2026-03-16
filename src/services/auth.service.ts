import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { DEFAULTS, ERROR_MESSAGES } from "../constants";

export const registerUser = async (data: any) => {
  const existingUser = await prisma.usuarios.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    DEFAULTS.BCRYPT_SALT_ROUNDS
  );

  const user = await prisma.usuarios.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      rol_id: data.rol_id,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

  const token = generateToken({
    id: user.id,
    rol_id: user.rol_id,
  });

  return { token };
};