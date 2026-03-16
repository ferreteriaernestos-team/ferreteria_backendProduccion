import { Router } from "express";
import * as ordenController from "../controllers/orden_compra.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: OrdenesCompra
 *   description: Gestión de órdenes de compra a proveedores
 */

/**
 * @swagger
 * /api/ordenes-compra:
 *   get:
 *     summary: Obtener todas las órdenes de compra
 *     tags: [OrdenesCompra]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes de compra
 */
router.get(
  "/",
  authMiddleware,
  ordenController.getOrdenesCompra
);

/**
 * @swagger
 * /api/ordenes-compra/{id}:
 *   get:
 *     summary: Obtener una orden de compra por ID
 *     tags: [OrdenesCompra]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de compra
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 */
router.get(
  "/:id",
  authMiddleware,
  ordenController.getOrdenCompraById
);

/**
 * @swagger
 * /api/ordenes-compra:
 *   post:
 *     summary: Crear una nueva orden de compra
 *     tags: [OrdenesCompra]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedor_id:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                       example: 3
 *                     cantidad:
 *                       type: integer
 *                       example: 20
 *                     precio_unitario:
 *                       type: number
 *                       example: 5
 *     responses:
 *       201:
 *         description: Orden de compra creada correctamente
 */
router.post(
  "/",
  authMiddleware,
  ordenController.crearOrdenCompra
);

/**
 * @swagger
 * /api/ordenes-compra/{id}/recibir:
 *   put:
 *     summary: Recibir orden de compra y actualizar inventario
 *     tags: [OrdenesCompra]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de compra
 *     responses:
 *       200:
 *         description: Orden recibida y stock actualizado
 *       400:
 *         description: Error al procesar la orden
 */
router.put(
  "/:id/recibir",
  authMiddleware,
  ordenController.recibirOrdenCompra
);

export default router;