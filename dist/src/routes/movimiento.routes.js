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
const movimientoController = __importStar(require("../controllers/movimiento.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
router.post("/", auth_middleware_1.authMiddleware, movimientoController.crearMovimiento);
/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar movimientos
 *     tags: [Movimientos]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", auth_middleware_1.authMiddleware, movimientoController.listarMovimientos);
exports.default = router;
