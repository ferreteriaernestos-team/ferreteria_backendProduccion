import { Request, Response } from "express";
import * as descuentoService from "../services/descuento.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";

export const getDescuentos = async (req: Request, res: Response) => {
  try {
    const soloActivos = req.query.activos === "true";
    const pagination = parsePagination(req.query);

    const { data, total } = await descuentoService.getAllDescuentos(soloActivos, pagination);

    res.json(paginatedResponse(data, total, pagination.page, pagination.limit));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDescuento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const descuento = await descuentoService.getDescuentoById(id);
    if (!descuento) {
      return res.status(404).json({ success: false, message: "Descuento no encontrado" });
    }
    res.json({ success: true, data: descuento });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDescuento = async (req: Request, res: Response) => {
  try {
    const descuento = await descuentoService.createDescuento(req.body);
    res.status(201).json({ success: true, data: descuento });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDescuento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const descuento = await descuentoService.updateDescuento(id, req.body);
    res.json({ success: true, data: descuento });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDescuento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await descuentoService.deleteDescuento(id);
    res.json({ success: true, message: "Descuento eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
