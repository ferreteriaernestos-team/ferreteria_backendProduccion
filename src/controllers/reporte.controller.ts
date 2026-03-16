import { Request, Response } from "express";
import * as reporteService from "../services/reporte.service";

import {
  ReportResponseDTO,
  DailyReportResponseDTO,
  MonthlyReportResponseDTO,
  TopProductsReportResponseDTO
} from "../dtos";

export const reporteCaja = async (req: Request, res: Response) => {
  try {
    const caja_id = Number(req.params.id);
    const reporte = await reporteService.reporteCajaPorId(caja_id);

    const response: ReportResponseDTO<any> = {
      success: true,
      data: reporte,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const reporteDiario = async (_req: Request, res: Response) => {
  try {
    const reporte = await reporteService.reporteDiario();

    const response: ReportResponseDTO<DailyReportResponseDTO> = {
      success: true,
      data: reporte,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reporteMensual = async (_req: Request, res: Response) => {
  try {
    const reporte = await reporteService.reporteMensual();

    const response: ReportResponseDTO<MonthlyReportResponseDTO> = {
      success: true,
      data: reporte,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reporteTopProductos = async (_req: Request, res: Response) => {
  try {

    const productos = await reporteService.reporteTopProductos();

    const response: ReportResponseDTO<TopProductsReportResponseDTO> = {
      success: true,
      data: {
        productos
      },
      timestamp: new Date()
    };

    res.json(response);

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};