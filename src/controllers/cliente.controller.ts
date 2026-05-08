import { Request, Response } from "express";
import * as clienteService from "../services/cliente.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";

export const getClientes = async (req: Request, res: Response) => {
  try {
    const { buscar } = req.query;
    const pagination = parsePagination(req.query);

    const { data, total } = await clienteService.getAllClientes(
      { buscar: buscar as string | undefined },
      pagination
    );

    res.json(paginatedResponse(data, total, pagination.page, pagination.limit));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.getClienteById(id);
    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }
    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buscarClientePorDocumento = async (req: Request, res: Response) => {
  try {
    const { documento } = req.query as { documento: string };
    if (!documento) {
      return res.status(400).json({ success: false, message: "Documento requerido" });
    }
    const cliente = await clienteService.getClienteByDocumento(documento);
    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }
    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.updateCliente(id, req.body);
    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await clienteService.deleteCliente(id);
    res.json({ success: true, message: "Cliente eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
