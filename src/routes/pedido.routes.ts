import { Router } from "express";
import {
  createPedido,
  confirmPedido,
  cancelPedido,
  listPedidos,
  getPedido,
  updateEstadoPedido,
} from "../controllers/pedido.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Pedidos online de clientes (pago en efectivo al delivery)
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear pedido online
 *     description: El cliente crea su pedido desde la tienda. Se envía un mensaje de WhatsApp al cliente para que confirme.
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - direccion_entrega
 *               - productos
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: ID del cliente si ya está registrado
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente (si no tiene cuenta)
 *               telefono:
 *                 type: string
 *                 description: Teléfono WhatsApp del cliente (si no tiene cuenta). Formato internacional, ej 50372880187
 *               email:
 *                 type: string
 *               direccion_entrega:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto_id
 *                     - cantidad
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *           examples:
 *             cliente_nuevo:
 *               summary: Cliente sin cuenta
 *               value:
 *                 nombre: "Juan Pérez"
 *                 telefono: "50372880187"
 *                 direccion_entrega: "Col. Escalón, 5a calle pte #123"
 *                 observaciones: "Dejar en portería"
 *                 productos:
 *                   - producto_id: 1
 *                     cantidad: 2
 *                   - producto_id: 3
 *                     cantidad: 1
 *             cliente_registrado:
 *               summary: Cliente con cuenta
 *               value:
 *                 cliente_id: 5
 *                 direccion_entrega: "Col. Escalón, 5a calle pte #123"
 *                 productos:
 *                   - producto_id: 1
 *                     cantidad: 2
 *     responses:
 *       201:
 *         description: Pedido creado. Se envió WhatsApp de confirmación al cliente.
 *       400:
 *         description: Datos inválidos o stock insuficiente
 */
router.post("/", createPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Listar pedidos (admin, paginado)
 *     tags: [Pedidos]
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
 *           enum: [PENDIENTE_CONFIRMACION, CONFIRMADO, EN_RUTA, ENTREGADO, CANCELADO]
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
 *         description: Lista paginada de pedidos
 */
router.get("/", authMiddleware, listPedidos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener pedido por ID (admin)
 *     tags: [Pedidos]
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
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/:id", authMiddleware, getPedido);

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     summary: Actualizar estado del pedido (admin)
 *     description: El admin actualiza el estado del pedido. Se notifica al cliente por WhatsApp al cambiar a EN_RUTA, ENTREGADO o CANCELADO.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [EN_RUTA, ENTREGADO, CANCELADO]
 *     responses:
 *       200:
 *         description: Estado actualizado y cliente notificado por WhatsApp
 *       400:
 *         description: Estado inválido o pedido no encontrado
 */
router.patch("/:id/estado", authMiddleware, updateEstadoPedido);

/**
 * @swagger
 * /api/pedidos/{id}/confirmar:
 *   patch:
 *     summary: Confirmar pedido manualmente (admin)
 *     description: Permite al admin confirmar un pedido manualmente si el cliente no pudo responder por WhatsApp.
 *     tags: [Pedidos]
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
 *         description: Pedido confirmado
 *       400:
 *         description: Pedido ya procesado o expirado
 */
router.patch("/:id/confirmar", authMiddleware, confirmPedido);

/**
 * @swagger
 * /api/pedidos/{id}/cancelar:
 *   patch:
 *     summary: Cancelar pedido manualmente (admin)
 *     tags: [Pedidos]
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
 *         description: Pedido cancelado
 *       400:
 *         description: No se puede cancelar un pedido ya entregado
 */
router.patch("/:id/cancelar", authMiddleware, cancelPedido);

export default router;
