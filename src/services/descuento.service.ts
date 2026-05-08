import { prisma } from "../config/prisma";

export const getAllDescuentos = async (
  soloActivos = false,
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where = soloActivos ? { activo: true } : undefined;

  const [total, data] = await prisma.$transaction([
    prisma.descuentos.count({ where }),
    prisma.descuentos.findMany({
      where,
      orderBy: { created_at: "desc" },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};

export const getDescuentoById = async (id: number) => {
  return prisma.descuentos.findUnique({ where: { id } });
};

export const createDescuento = async (data: {
  nombre: string;
  tipo: "PORCENTAJE" | "VALOR_FIJO";
  valor: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
}) => {
  return prisma.descuentos.create({ data: { ...data, activo: true } });
};

export const updateDescuento = async (
  id: number,
  data: {
    nombre?: string;
    tipo?: "PORCENTAJE" | "VALOR_FIJO";
    valor?: number;
    activo?: boolean;
    fecha_inicio?: Date;
    fecha_fin?: Date;
  }
) => {
  return prisma.descuentos.update({ where: { id }, data });
};

export const deleteDescuento = async (id: number) => {
  return prisma.descuentos.update({ where: { id }, data: { activo: false } });
};
