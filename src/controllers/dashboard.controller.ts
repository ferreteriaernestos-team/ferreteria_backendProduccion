import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data
    });

  } catch (error: any) {
    console.error("Error dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Error obteniendo dashboard"
    });
  }
};