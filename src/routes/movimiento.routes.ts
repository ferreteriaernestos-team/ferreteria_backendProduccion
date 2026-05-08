import { Router } from "express";
import * as movimientoController from "../controllers/movimiento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movimientos
 *   description: Movimientos de inventario
 */

/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar movimientos
 *     tags: [Movimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error del servidor
 */
/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Registrar movimiento de inventario
 *     tags: [Movimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [ENTRADA, SALIDA, AJUSTE]
 *               cantidad:
 *                 type: integer
 *               referencia:
 *                 type: string
 *               observacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimiento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error en movimiento
 */

/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Registrar movimiento de inventario
 *     tags: [Movimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *               - tipo
 *               - cantidad
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 example: 1
 *               tipo:
 *                 type: string
 *                 enum: [ENTRADA, SALIDA, AJUSTE]
 *               cantidad:
 *                 type: integer
 *                 example: 5
 *               referencia:
 *                 type: string
 *                 example: VENTA-1
 *               observacion:
 *                 type: string
 *                 example: Venta mostrador
 */
router.post("/", authMiddleware, movimientoController.crearMovimiento);

/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar movimientos de inventario (paginado)
 *     tags: [Movimientos]
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
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ENTRADA, SALIDA, AJUSTE]
 *       - in: query
 *         name: producto_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista paginada de movimientos
 */
router.get("/", authMiddleware, movimientoController.listarMovimientos);

export default router;