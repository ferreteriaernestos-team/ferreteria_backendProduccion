import { Request, Response } from "express";
import * as categoriaService from "../services/categoria.service";

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await categoriaService.getAllCategorias();
    res.json({ success: true, data: categorias, total: categorias.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categoria = await categoriaService.getCategoriaById(id);
    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }
    res.json({ success: true, data: categoria });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await categoriaService.createCategoria(req.body);
    res.status(201).json({ success: true, data: categoria });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCategoria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categoria = await categoriaService.updateCategoria(id, req.body);
    res.json({ success: true, data: categoria });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategoria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await categoriaService.deleteCategoria(id);
    res.json({ success: true, message: "Categoría eliminada correctamente" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
