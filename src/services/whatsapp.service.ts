import axios from "axios";

export const enviarWhatsApp = async (mensaje: string) => {
  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: process.env.WHATSAPP_ADMIN_NUMBER,
      type: "text",
      text: { body: mensaje },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};