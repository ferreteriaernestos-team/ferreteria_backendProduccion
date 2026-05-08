import { prisma } from "../config/prisma";
import { DEFAULTS } from "../constants";

export const getAllProducts = async (
  filters?: {
    categoria_id?: number;
    marca?: string;
    inStock?: boolean;
    maxPrice?: number;
    buscar?: string;
  },
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where = {
    activo: true,
    ...(filters?.categoria_id && { categoria_id: filters.categoria_id }),
    ...(filters?.marca && { marca: { contains: filters.marca } }),
    ...(filters?.inStock === true && { stock: { gt: 0 } }),
    ...(filters?.maxPrice && { precio_venta: { lte: filters.maxPrice } }),
    ...(filters?.buscar && {
      OR: [
        { nombre: { contains: filters.buscar } },
        { descripcion: { contains: filters.buscar } },
        { marca: { contains: filters.buscar } },
        { codigo: { contains: filters.buscar } },
      ],
    }),
  };

  const [total, data] = await prisma.$transaction([
    prisma.productos.count({ where }),
    prisma.productos.findMany({
      where,
      include: {
        categorias: { select: { id: true, nombre: true } },
        proveedores: { select: { id: true, nombre: true } },
      },
      orderBy: { nombre: "asc" },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};

export const getMarcas = async () => {
  const productos = await prisma.productos.findMany({
    where: { activo: true, marca: { not: null } },
    select: { marca: true },
    distinct: ["marca"],
    orderBy: { marca: "asc" },
  });
  return productos.map((p) => p.marca).filter(Boolean);
};

export const getProductById = async (id: number) => {
  return prisma.productos.findUnique({
    where: { id },
    include: {
      categorias: { select: { id: true, nombre: true } },
      proveedores: { select: { id: true, nombre: true } },
    },
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
      precio_anterior: data.precio_anterior ?? null,
      stock: data.stock ?? DEFAULTS.PRODUCT_INITIAL_STOCK,
      stock_minimo: data.stock_minimo ?? DEFAULTS.PRODUCT_MINIMUM_STOCK,
      marca: data.marca ?? null,
      imagen: data.imagen ?? null,
      badge: data.badge ?? null,
      proveedor_id: data.proveedor_id,
      categoria_id: data.categoria_id,
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
    data: { activo: false },
  });
};
