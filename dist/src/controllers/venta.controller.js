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
exports.cancelarVenta = exports.crearVenta = void 0;
const ventaService = __importStar(require("../services/venta.service"));
const constants_1 = require("../constants");
const crearVenta = async (req, res) => {
    try {
        const usuario = req.user;
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.USER_NOT_AUTHENTICATED,
            });
        }
        const saleData = req.body;
        const venta = await ventaService.crearVenta(saleData, usuario.id);
        const response = {
            id: venta.id,
            usuario_id: venta.usuario_id,
            total: venta.total,
            metodo_pago: venta.metodo_pago,
            estado: venta.estado,
            created_at: venta.created_at,
        };
        return res.status(201).json({
            success: true,
            message: constants_1.SUCCESS_MESSAGES.SALE_CREATED,
            data: response,
        });
    }
    catch (error) {
        console.error(constants_1.LOG_MESSAGES.ERROR_CREATING_SALE, error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.crearVenta = crearVenta;
const cancelarVenta = async (req, res) => {
    try {
        const usuario = req.user;
        const venta_id = Number(req.params.id);
        if (isNaN(venta_id)) {
            return res.status(400).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.INVALID_ID,
            });
        }
        const result = await ventaService.cancelarVenta(venta_id, usuario.id);
        const response = {
            success: true,
            message: constants_1.SUCCESS_MESSAGES.SALE_CANCELLED,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(constants_1.LOG_MESSAGES.ERROR_CANCELLING_SALE, error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.cancelarVenta = cancelarVenta;
