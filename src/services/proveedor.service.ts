import { prisma } from "../config/prisma";

export const getProveedores = async (
  filters?: { buscar?: string },
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where = {
    ...(filters?.buscar && {
      OR: [
        { nombre: { contains: filters.buscar } },
        { email: { contains: filters.buscar } },
      ],
    }),
  };

  const [total, data] = await prisma.$transaction([
    prisma.proveedores.count({ where }),
    prisma.proveedores.findMany({
      where,
      orderBy: { nombre: "asc" },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};

export const getProveedorById = async (id: number) => {

  const proveedor = await prisma.proveedores.findUnique({
    where: { id }
  });

  if (!proveedor) {
    throw new Error("Proveedor no encontrado");
  }

  return proveedor;

};

export const createProveedor = async (data: any) => {

  return prisma.proveedores.create({
    data
  });

};

export const updateProveedor = async (id: number, data: any) => {

  return prisma.proveedores.update({
    where: { id },
    data
  });

};

export const deleteProveedor = async (id: number) => {

  await prisma.proveedores.delete({
    where: { id }
  });

};