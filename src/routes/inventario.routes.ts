import { Router } from "express"
import * as inventarioController from "../controllers/inventario.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Estado del inventario
 */

/**
 * @swagger
 * /api/inventario/criticos:
 *   get:
 *     summary: Obtener productos con stock crítico
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 */
router.get(
  "/criticos",
  authMiddleware,
  inventarioController.getProductosCriticos
)

export default router