"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController = __importStar(require("../controllers/product.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
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
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", auth_middleware_1.authMiddleware, productController.getProducts);
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
router.get("/:id", auth_middleware_1.authMiddleware, productController.getProduct);
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
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRole)([1, 2]), productController.createProduct);
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
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRole)([1, 2]), productController.updateProduct);
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
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRole)([1]), productController.deleteProduct);
exports.default = router;
