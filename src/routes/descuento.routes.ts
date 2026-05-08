import { Router } from "express";
import * as descuentoController from "../controllers/descuento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Descuentos
 *   description: Gestión de descuentos y promociones
 */

/**
 * @swagger
 * /api/descuentos:
 *   get:
 *     summary: Obtener todos los descuentos (paginado)
 *     tags: [Descuentos]
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
 *         name: activos
 *         schema:
 *           type: boolean
 *         description: Si es true, retorna solo descuentos activos
 *     responses:
 *       200:
 *         description: Lista paginada de descuentos
 */
router.get("/", authMiddleware, descuentoController.getDescuentos);

/**
 * @swagger
 * /api/descuentos/{id}:
 *   get:
 *     summary: Obtener descuento por ID
 *     tags: [Descuentos]
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
 *         description: Descuento encontrado
 *       404:
 *         description: Descuento no encontrado
 */
router.get("/:id", authMiddleware, descuentoController.getDescuento);

/**
 * @swagger
 * /api/descuentos:
 *   post:
 *     summary: Crear nuevo descuento
 *     tags: [Descuentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - valor
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Descuento Verano
 *               tipo:
 *                 type: string
 *                 enum: [PORCENTAJE, VALOR_FIJO]
 *               valor:
 *                 type: number
 *                 example: 10
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Descuento creado correctamente
 */
router.post("/", authMiddleware, authorizeRole([1, 2]), descuentoController.createDescuento);

/**
 * @swagger
 * /api/descuentos/{id}:
 *   put:
 *     summary: Actualizar descuento
 *     tags: [Descuentos]
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
 *         description: Descuento actualizado
 */
router.put("/:id", authMiddleware, authorizeRole([1, 2]), descuentoController.updateDescuento);

/**
 * @swagger
 * /api/descuentos/{id}:
 *   delete:
 *     summary: Desactivar descuento
 *     tags: [Descuentos]
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
 *         description: Descuento desactivado
 */
router.delete("/:id", authMiddleware, authorizeRole([1]), descuentoController.deleteDescuento);

export default router;
