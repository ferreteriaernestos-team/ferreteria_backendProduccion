import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generarMensajeStockCritico = async (producto: any) => {
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
