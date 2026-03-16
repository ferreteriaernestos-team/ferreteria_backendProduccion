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
const reporteController = __importStar(require("../controllers/reporte.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes financieros y operativos
 */
/**
 * @swagger
 * /api/reportes/caja/{id}:
 *   get:
 *     summary: Reporte detallado de una caja
 *     tags: [Reportes]
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
 *         description: Reporte de caja generado correctamente
 */
router.get("/caja/:id", auth_middleware_1.authMiddleware, reporteController.reporteCaja);
/**
 * @swagger
 * /api/reportes/diario:
 *   get:
 *     summary: Reporte diario general
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte diario generado correctamente
 */
router.get("/diario", auth_middleware_1.authMiddleware, reporteController.reporteDiario);
/**
 * @swagger
 * /api/reportes/mensual:
 *   get:
 *     summary: Reporte mensual general
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte mensual generado correctamente
 */
router.get("/mensual", auth_middleware_1.authMiddleware, reporteController.reporteMensual);
exports.default = router;
