import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos (paginado)
 *     tags: [Productos]
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
 *         name: categoria_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 */
router.get("/", authMiddleware, productController.getProducts);

/**
 * @swagger
 * /api/products/marcas:
 *   get:
 *     summary: Obtener listado de marcas disponibles
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas
 */
router.get("/marcas", authMiddleware, productController.getMarcas);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", authMiddleware, productController.getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Productos]
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
 *               - precio_compra
 *               - precio_venta
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Martillo Profesional
 *               descripcion:
 *                 type: string
 *                 example: Martillo de acero reforzado
 *               codigo:
 *                 type: string
 *                 example: MAR-001
 *               precio_compra:
 *                 type: number
 *                 example: 5.50
 *               precio_venta:
 *                 type: number
 *                 example: 9.99
 *               stock:
 *                 type: integer
 *                 example: 10
 *               stock_minimo:
 *                 type: integer
 *                 example: 3
 *               proveedor_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */
router.post(
  "/",
  authMiddleware,
  authorizeRole([1, 2]),
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               codigo:
 *                 type: string
 *               precio_compra:
 *                 type: number
 *               precio_venta:
 *                 type: number
 *               stock:
 *                 type: integer
 *               stock_minimo:
 *                 type: integer
 *               proveedor_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 */
router.put(
  "/:id",
  authMiddleware,
  authorizeRole([1, 2]),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (borrado lógico)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole([1]),
  productController.deleteProduct
);

export default router;