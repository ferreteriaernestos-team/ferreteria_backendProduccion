import { prisma } from "../config/prisma";
import {
  CAJA_STATES,
  BOX_MOVEMENT_TYPES,
  ERROR_MESSAGES,
} from "../constants";

export const abrirCaja = async (usuario_id: number, monto_inicial: number) => {
  const cajaAbierta = await prisma.caja.findFirst({
    where: {
      usuario_id,
      estado: CAJA_STATES.ABIERTA,
    },
  });

  if (cajaAbierta) {
    throw new Error(ERROR_MESSAGES.BOX_ALREADY_OPEN);
  }

  return prisma.caja.create({
    data: {
      usuario_id,
      fecha_apertura: new Date(),
      monto_inicial,
    },
  });
};

export const cerrarCaja = async (usuario_id: number) => {
  const cajaAbierta = await prisma.caja.findFirst({
    where: {
      usuario_id,
      estado: CAJA_STATES.ABIERTA,
    },
  });

  if (!cajaAbierta) {
    throw new Error(ERROR_MESSAGES.NO_OPEN_BOX);
  }

  const movimientos = await prisma.movimientos_caja.findMany({
    where: { caja_id: cajaAbierta.id },
  });

  const totalMovimientos = movimientos.reduce(
    (acc, mov) =>
      mov.tipo === BOX_MOVEMENT_TYPES.INGRESO
        ? acc + Number(mov.monto)
        : acc - Number(mov.monto),
    0
  );

  const monto_final =
    Number(cajaAbierta.monto_inicial) + totalMovimientos;

  return prisma.caja.update({
    where: { id: cajaAbierta.id },
    data: {
      estado: CAJA_STATES.CERRADA,
      fecha_cierre: new Date(),
      monto_final,
    },
  });
};