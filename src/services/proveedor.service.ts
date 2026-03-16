import { prisma } from "../config/prisma";

export const getProveedores = async () => {

  return prisma.proveedores.findMany({
    orderBy: {
      nombre: "asc"
    }
  });

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