import { Request, Response } from "express";
import * as cajaService from "../services/caja.service";
import { SUCCESS_MESSAGES } from "../constants";
import {
  OpenBoxRequestDTO,
  OpenBoxResponseDTO,
  CloseBoxResponseDTO,
} from "../dtos";

export const abrirCaja = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    const boxData: OpenBoxRequestDTO = req.body;

    const caja = await cajaService.abrirCaja(
      usuario.id,
      Number(boxData.monto_inicial)
    );

    const response: OpenBoxResponseDTO = {
      success: true,
      message: SUCCESS_MESSAGES.BOX_OPENED,
      data: caja,
    };

    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cerrarCaja = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;

    const caja = await cajaService.cerrarCaja(usuario.id);

    const response: CloseBoxResponseDTO = {
      success: true,
      message: SUCCESS_MESSAGES.BOX_CLOSED,
      data: caja,
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};