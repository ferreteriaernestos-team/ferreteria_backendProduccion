import { Request, Response } from "express";
import * as proveedorService from "../services/proveedor.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";

export const getProveedores = async (req: Request, res: Response) => {

  try {

    const { buscar } = req.query;
    const pagination = parsePagination(req.query);

    const { data, total } = await proveedorService.getProveedores(
      { buscar: buscar as string | undefined },
      pagination
    );

    res.json(paginatedResponse(data, total, pagination.page, pagination.limit));

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getProveedorById = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const proveedor = await proveedorService.getProveedorById(id);

    res.json({
      success: true,
      data: proveedor,
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

export const createProveedor = async (req: Request, res: Response) => {

  try {

    const proveedor = await proveedorService.createProveedor(req.body);

    res.status(201).json({
      success: true,
      data: proveedor,
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const updateProveedor = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const proveedor = await proveedorService.updateProveedor(id, req.body);

    res.json({
      success: true,
      data: proveedor,
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const deleteProveedor = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    await proveedorService.deleteProveedor(id);

    res.json({
      success: true,
      message: "Proveedor eliminado correctamente",
      timestamp: new Date()
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};