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
exports.listarMovimientos = exports.crearMovimiento = void 0;
const movimientoService = __importStar(require("../services/movimiento.service"));
const constants_1 = require("../constants");
const crearMovimiento = async (req, res) => {
    try {
        const usuario = req.user;
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.USER_NOT_AUTHENTICATED,
            });
        }
        const movementData = req.body;
        const movimiento = await movimientoService.crearMovimiento(movementData, usuario.id);
        const response = {
            success: true,
            message: constants_1.SUCCESS_MESSAGES.MOVEMENT_CREATED,
            data: movimiento,
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.error(constants_1.LOG_MESSAGES.ERROR_CREATING_MOVEMENT, error);
        return res.status(400).json({
            success: false,
            message: error.message || constants_1.ERROR_MESSAGES.ERROR_REGISTERING_MOVEMENT,
        });
    }
};
exports.crearMovimiento = crearMovimiento;
const listarMovimientos = async (req, res) => {
    try {
        const movimientos = await movimientoService.listarMovimientos();
        const response = {
            movimientos: movimientos,
            total: movimientos.length,
        };
        return res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error(constants_1.LOG_MESSAGES.ERROR_LISTING_MOVEMENTS, error);
        return res.status(500).json({
            success: false,
            message: constants_1.ERROR_MESSAGES.ERROR_FETCHING_MOVEMENTS,
        });
    }
};
exports.listarMovimientos = listarMovimientos;
