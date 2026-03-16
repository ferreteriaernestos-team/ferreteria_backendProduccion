"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarMensajeStockCritico = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generarMensajeStockCritico = async (producto) => {
    const prompt = `
Genera un mensaje corto y profesional para WhatsApp
informando sobre stock crítico en una ferretería.

Producto: ${producto.nombre}
Stock actual: ${producto.stock}
Stock mínimo: ${producto.stock_minimo}
Días estimados restantes: ${producto.dias_restantes}
Cantidad sugerida de reorden: ${producto.cantidad_sugerida}
`;
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content || "";
};
exports.generarMensajeStockCritico = generarMensajeStockCritico;
