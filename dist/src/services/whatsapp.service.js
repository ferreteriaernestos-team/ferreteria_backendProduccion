"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarWhatsApp = void 0;
const axios_1 = __importDefault(require("axios"));
const enviarWhatsApp = async (mensaje) => {
    await axios_1.default.post(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_ADMIN_NUMBER,
        type: "text",
        text: { body: mensaje },
    }, {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
};
exports.enviarWhatsApp = enviarWhatsApp;
