"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarMonitorStock = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const stock_alert_service_1 = require("../services/stock-alert.service");
const iniciarMonitorStock = () => {
    // Ejecutar todos los días a las 7am
    node_cron_1.default.schedule("0 7 * * *", async () => {
        console.log("🔎 Verificando stock crítico...");
        await (0, stock_alert_service_1.verificarStockCritico)();
    });
};
exports.iniciarMonitorStock = iniciarMonitorStock;
