import { Request, Response } from "express";
import * as ordenService from "../services/orden_compra.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";

export const crearOrdenCompra = async (req: Request, res: Response) => {

  try {

    const usuario_id = (req as any).user.id;

    const orden = await ordenService.crearOrdenCompra(
      req.body,
      usuario_id
    );

    res.status(201).json({
      success: true,
      data: orden,
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const getOrdenesCompra = async (req: Request, res: Response) => {

  try {

    const { estado, proveedor_id } = req.query;
    const pagination = parsePagination(req.query);

    const { data, total } = await ordenService.getOrdenesCompra(
      {
        estado: estado as string | undefined,
        proveedor_id: proveedor_id ? Number(proveedor_id) : undefined,
      },
      pagination
    );

    res.json(paginatedResponse(data, total, pagination.page, pagination.limit));

  } catch (error: any) {

    res.status(500).json({ success: false, message: error.message });

  }

};

export const getOrdenCompraById = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const orden = await ordenService.getOrdenCompraById(id);

  res.json({
    success: true,
    data: orden,
    timestamp: new Date()
  });

};

export const recibirOrdenCompra = async (req: Request, res: Response) => {

  try {

    const orden_id = Number(req.params.id);
    const usuario_id = (req as any).user.id;

    const result = await ordenService.recibirOrdenCompra(
      orden_id,
      usuario_id
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};