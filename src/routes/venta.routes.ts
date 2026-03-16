import { Router } from "express";
import * as ventaController from "../controllers/venta.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Gestión de ventas
 */

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registrar venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metodo_pago
 *               - productos
 *             properties:
 *               metodo_pago:
 *                 type: string
 *                 enum: [EFECTIVO, TARJETA, TRANSFERENCIA]
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Venta creada correctamente
 */
router.post("/", authMiddleware, ventaController.crearVenta);

/**
 * @swagger
 * /api/ventas/{id}/cancelar:
 *   put:
 *     summary: Cancelar venta
 *     tags: [Ventas]
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
 *         description: Venta cancelada correctamente
 * 
 * 
 */

/**
 * @swagger
 * /api/ventas/{id}/cancelar:
 *   put:
 *     summary: Cancelar venta
 *     tags: [Ventas]
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
 *         description: Venta cancelada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put("/:id/cancelar", authMiddleware, ventaController.cancelarVenta);
router.put("/:id/cancelar", authMiddleware, ventaController.cancelarVenta);

export default router;