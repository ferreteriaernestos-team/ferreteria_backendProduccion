import { Router } from "express";
import * as reporteController from "../controllers/reporte.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes financieros y operativos
 */

/**
 * @swagger
 * /api/reportes/caja/{id}:
 *   get:
 *     summary: Reporte detallado de una caja
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de caja generado correctamente
 */
router.get("/caja/:id", authMiddleware, reporteController.reporteCaja);

/**
 * @swagger
 * /api/reportes/diario:
 *   get:
 *     summary: Reporte diario general
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte diario generado correctamente
 */
router.get("/diario", authMiddleware, reporteController.reporteDiario);

/**
 * @swagger
 * /api/reportes/mensual:
 *   get:
 *     summary: Reporte mensual general
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte mensual generado correctamente
 */
router.get("/mensual", authMiddleware, reporteController.reporteMensual);

/**
 * @swagger
 * /api/reportes/top-productos:
 *   get:
 *     summary: Obtener productos más vendidos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
 */
router.get(
  "/top-productos",
  authMiddleware,
  reporteController.reporteTopProductos
);

export default router;