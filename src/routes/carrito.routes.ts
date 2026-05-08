import { Router } from "express";
import * as carritoController from "../controllers/carrito.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Carrito de compras para clientes online
 */

/**
 * @swagger
 * /api/carrito:
 *   get:
 *     summary: Obtener el carrito actual
 *     tags: [Carrito]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de sesión único del cliente (generado en el frontend)
 *     responses:
 *       200:
 *         description: Carrito con items, subtotal y total_items
 *       400:
 *         description: session_id requerido
 */
router.get("/", carritoController.getCarrito);

/**
 * @swagger
 * /api/carrito/items:
 *   post:
 *     summary: Agregar o actualizar un producto en el carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - producto_id
 *               - cantidad
 *             properties:
 *               session_id:
 *                 type: string
 *                 example: abc123xyz
 *               producto_id:
 *                 type: integer
 *                 example: 5
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *               cliente_id:
 *                 type: integer
 *                 description: Opcional. Si el cliente está identificado, asocia el carrito.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       400:
 *         description: Datos inválidos o stock insuficiente
 */
router.post("/items", carritoController.addItem);

/**
 * @swagger
 * /api/carrito/items/{producto_id}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - cantidad
 *             properties:
 *               session_id:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       400:
 *         description: Stock insuficiente o producto no encontrado
 */
router.put("/items/:producto_id", carritoController.updateItem);

/**
 * @swagger
 * /api/carrito/items/{producto_id}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item eliminado, carrito actualizado
 */
router.delete("/items/:producto_id", carritoController.removeItem);

/**
 * @swagger
 * /api/carrito:
 *   delete:
 *     summary: Vaciar el carrito completo
 *     tags: [Carrito]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete("/", carritoController.clearCarrito);

/**
 * @swagger
 * /api/carrito/checkout:
 *   post:
 *     summary: Convertir el carrito en un pedido (delivery con pago en efectivo)
 *     description: Crea un pedido a partir del carrito activo y envía confirmación por WhatsApp al cliente. El carrito se vacía automáticamente.
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - direccion_entrega
 *             properties:
 *               session_id:
 *                 type: string
 *                 example: abc123xyz
 *               direccion_entrega:
 *                 type: string
 *                 example: "Col. Escalón, 5a calle pte #123"
 *               observaciones:
 *                 type: string
 *                 example: "Dejar en portería"
 *               cliente_id:
 *                 type: integer
 *                 description: Si el cliente ya está registrado
 *                 example: 3
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente (si no tiene cuenta)
 *               telefono:
 *                 type: string
 *                 description: Teléfono WhatsApp del cliente (si no tiene cuenta)
 *               email:
 *                 type: string
 *           examples:
 *             cliente_registrado:
 *               summary: Con cliente registrado
 *               value:
 *                 session_id: "abc123xyz"
 *                 cliente_id: 3
 *                 direccion_entrega: "Col. Escalón, 5a calle pte #123"
 *             cliente_nuevo:
 *               summary: Sin cuenta
 *               value:
 *                 session_id: "abc123xyz"
 *                 nombre: "Juan Pérez"
 *                 telefono: "50372880187"
 *                 direccion_entrega: "Col. Escalón, 5a calle pte #123"
 *     responses:
 *       201:
 *         description: Pedido creado. Cliente notificado por WhatsApp.
 *       400:
 *         description: Carrito vacío, stock insuficiente, o datos faltantes
 */
router.post("/checkout", carritoController.checkout);

export default router;
