import { prisma } from "../config/prisma";

export const getAllClientes = async (
  filters?: { buscar?: string },
  pagination?: { page: number; limit: number; skip: number }
) => {
  const where = {
    activo: true,
    ...(filters?.buscar && {
      OR: [
        { nombre: { contains: filters.buscar } },
        { documento: { contains: filters.buscar } },
        { email: { contains: filters.buscar } },
        { telefono: { contains: filters.buscar } },
      ],
    }),
  };

  const [total, data] = await prisma.$transaction([
    prisma.clientes.count({ where }),
    prisma.clientes.findMany({
      where,
      orderBy: { nombre: "asc" },
      ...(pagination && { skip: pagination.skip, take: pagination.limit }),
    }),
  ]);

  return { data, total };
};

export const getClienteById = async (id: number) => {
  return prisma.clientes.findUnique({ where: { id } });
};

export const getClienteByDocumento = async (documento: string) => {
  return prisma.clientes.findUnique({ where: { documento } });
};

export const createCliente = async (data: {
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}) => {
  return prisma.clientes.create({ data });
};

export const updateCliente = async (
  id: number,
  data: {
    nombre?: string;
    documento?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo?: boolean;
  }
) => {
  return prisma.clientes.update({ where: { id }, data });
};

export const deleteCliente = async (id: number) => {
  return prisma.clientes.update({ where: { id }, data: { activo: false } });
};
