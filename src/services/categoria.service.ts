import { prisma } from "../config/prisma";

export const getAllCategorias = async () => {
  return prisma.categorias.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });
};

export const getCategoriaById = async (id: number) => {
  return prisma.categorias.findUnique({ where: { id } });
};

export const createCategoria = async (data: {
  nombre: string;
  descripcion?: string;
}) => {
  return prisma.categorias.create({ data });
};

export const updateCategoria = async (
  id: number,
  data: { nombre?: string; descripcion?: string; activo?: boolean }
) => {
  return prisma.categorias.update({ where: { id }, data });
};

export const deleteCategoria = async (id: number) => {
  return prisma.categorias.update({ where: { id }, data: { activo: false } });
};
