import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
  ProductListResponseDTO,
} from "../dtos";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    
    const response: ProductListResponseDTO = {
      productos: products as any[],
      total: products.length,
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }

    res.json(product as any);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createProduct = async (req: Request, res: Response) => {
  try {
    const dto: CreateProductRequestDTO = req.body;

    const producto = await productService.createProduct(dto);

    res.status(201).json({
      success: true,
      data: producto
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updateData: UpdateProductRequestDTO = req.body;
    const product = await productService.updateProduct(id, updateData);

    res.json(product as any);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await productService.deleteProduct(id);

    res.json({ success: true, message: SUCCESS_MESSAGES.PRODUCT_DELETED });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};