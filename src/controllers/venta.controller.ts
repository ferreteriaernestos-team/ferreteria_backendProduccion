import { Request, Response } from "express";
import * as ventaService from "../services/venta.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOG_MESSAGES } from "../constants";
import {
  CreateSaleRequestDTO,
  SaleResponseDTO,
  CancelSaleResponseDTO,
} from "../dtos";

export const crearVenta = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_AUTHENTICATED,
      });
    }

    const saleData: CreateSaleRequestDTO = req.body;
    const venta = await ventaService.crearVenta(saleData, usuario.id);

    const response: SaleResponseDTO = {
      id: (venta as any).id,
      usuario_id: (venta as any).usuario_id,
      total: (venta as any).total,
      metodo_pago: (venta as any).metodo_pago,
      estado: (venta as any).estado,
      created_at: (venta as any).created_at,
    };

    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.SALE_CREATED,
      data: response,
    });
  } catch (error: any) {
    console.error(LOG_MESSAGES.ERROR_CREATING_SALE, error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelarVenta = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;

    const venta_id = Number(req.params.id);

    if (isNaN(venta_id)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_ID,
      });
    }

    const result = await ventaService.cancelarVenta(venta_id, usuario.id);

    const response: CancelSaleResponseDTO = {
      success: true,
      message: SUCCESS_MESSAGES.SALE_CANCELLED,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error(LOG_MESSAGES.ERROR_CANCELLING_SALE, error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};