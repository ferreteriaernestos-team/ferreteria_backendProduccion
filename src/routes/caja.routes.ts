import { Router } from "express";
import * as cajaController from "../controllers/caja.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Caja
 *   description: Gestión de caja
 */

/**
 * @swagger
 * /api/caja/abrir:
 *   post:
 *     summary: Abrir caja
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto_inicial:
 *                 type: number
 *     responses:
 *       201:
 *         description: Caja abierta correctamente
 */
router.post("/abrir", authMiddleware, cajaController.abrirCaja);

/**
 * @swagger
 * /api/caja/cerrar:
 *   put:
 *     summary: Cerrar caja
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caja cerrada correctamente
 */
router.put("/cerrar", authMiddleware, cajaController.cerrarCaja);

export default router;