import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener resumen del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard
 */
router.get("/", authMiddleware, dashboardController.getDashboard);

export default router;