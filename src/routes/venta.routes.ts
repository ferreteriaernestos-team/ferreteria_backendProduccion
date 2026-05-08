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
 *   get:
 *     summary: Listar ventas con filtros opcionales (paginado)
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [COMPLETADA, CANCELADA]
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista paginada de ventas
 */
router.get("/", authMiddleware, ventaController.listarVentas);

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener venta por ID con detalle completo
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
 *         description: Venta encontrada
 *       404:
 *         description: Venta no encontrada
 */
router.get("/:id", authMiddleware, ventaController.getVenta);

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
 *               cliente_id:
 *                 type: integer
 *               descuento_id:
 *                 type: integer
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
 */
router.put("/:id/cancelar", authMiddleware, ventaController.cancelarVenta);

export default router;
