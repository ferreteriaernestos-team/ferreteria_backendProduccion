import { prisma } from "../config/prisma";
import { DEFAULTS } from "../constants";

export const getAllProducts = async () => {
  return prisma.productos.findMany();
};

export const getProductById = async (id: number) => {
  return prisma.productos.findUnique({
    where: { id },
  });
};

export const createProduct = async (data: any) => {
  return prisma.productos.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      codigo: data.codigo,
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      stock: data.stock ?? DEFAULTS.PRODUCT_INITIAL_STOCK,
      stock_minimo: data.stock_minimo ?? DEFAULTS.PRODUCT_MINIMUM_STOCK,
      proveedor_id: data.proveedor_id,
      activo: true,
    },
  });
};

export const updateProduct = async (id: number, data: any) => {
  return prisma.productos.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.productos.update({
    where: { id },
    data: { activo: false }, // 🔥 borrado lógico
  });
};