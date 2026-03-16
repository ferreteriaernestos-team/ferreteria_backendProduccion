import { Request, Response } from "express";
import * as movimientoService from "../services/movimiento.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOG_MESSAGES } from "../constants";
import {
  CreateMovementRequestDTO,
  CreateMovementResponseDTO,
  MovementListResponseDTO,
  MovementResponseDTO,
} from "../dtos";

export const crearMovimiento = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_AUTHENTICATED,
      });
    }

    const movementData: CreateMovementRequestDTO = req.body;
    const movimiento = await movimientoService.crearMovimiento(
      movementData,
      usuario.id
    );

    const response: CreateMovementResponseDTO = {
      success: true,
      message: SUCCESS_MESSAGES.MOVEMENT_CREATED,
      data: movimiento as MovementResponseDTO,
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.error(LOG_MESSAGES.ERROR_CREATING_MOVEMENT, error);

    return res.status(400).json({
      success: false,
      message: error.message || ERROR_MESSAGES.ERROR_REGISTERING_MOVEMENT,
    });
  }
};

export const listarMovimientos = async (req: Request, res: Response) => {
  try {
    const movimientos = await movimientoService.listarMovimientos();

    const response: MovementListResponseDTO = {
      movimientos: movimientos as any[],
      total: movimientos.length,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error(LOG_MESSAGES.ERROR_LISTING_MOVEMENTS, error);

    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.ERROR_FETCHING_MOVEMENTS,
    });
  }
};