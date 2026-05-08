import { Request, Response } from "express";
import {
  crearPedido,
  confirmarPedido,
  cancelarPedido,
  getPedidos,
  getPedidoById,
  actualizarEstadoPedido,
} from "../services/pedido.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";

export const createPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedido = await crearPedido(req.body);
    res.status(201).json(pedido);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const pedido = await confirmarPedido(id);
    res.json({ message: "Pedido confirmado exitosamente", pedido });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const pedido = await cancelarPedido(id);
    res.json({ message: "Pedido cancelado", pedido });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, cliente_id, fecha_desde, fecha_hasta } = req.query as Record<string, string>;
    const pagination = parsePagination(req.query);

    const { data, total } = await getPedidos(
      {
        estado,
        cliente_id: cliente_id ? parseInt(cliente_id, 10) : undefined,
        fecha_desde,
        fecha_hasta,
      },
      pagination
    );

    res.json(paginatedResponse(data, total, pagination.page, pagination.limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const pedido = await getPedidoById(id);
    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }
    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEstadoPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { estado } = req.body;

    const estadosPermitidos = ["EN_RUTA", "ENTREGADO", "CANCELADO"];
    if (!estadosPermitidos.includes(estado)) {
      res.status(400).json({ error: `Estado inválido. Permitidos: ${estadosPermitidos.join(", ")}` });
      return;
    }

    const pedido = await actualizarEstadoPedido(id, estado);
    res.json({ message: `Pedido actualizado a ${estado}`, pedido });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
