import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

let whatsappClient: Client | null = null;
let isClientReady = false;
let isReconnecting = false;

// ─── Reconexión automática ────────────────────────────────────────────────────

async function reconnect(): Promise<void> {
  if (isReconnecting) return;
  isReconnecting = true;
  console.log("🔄 [WhatsApp] Reconectando en 8 segundos...");

  await delay(8000);

  try {
    if (whatsappClient) {
      await whatsappClient.destroy().catch(() => {});
      whatsappClient = null;
    }
    isClientReady = false;
    await initializeWhatsappClient();
    console.log("✅ [WhatsApp] Reconexión exitosa");
  } catch (error) {
    console.error("❌ [WhatsApp] Falló la reconexión:", error);
  } finally {
    isReconnecting = false;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFrameError(error: unknown): boolean {
  const msg = String(error);
  return (
    msg.includes("detached Frame") ||
    msg.includes("Session closed") ||
    msg.includes("Target closed") ||
    msg.includes("Protocol error")
  );
}

// ─── Inicialización ───────────────────────────────────────────────────────────

export const initializeWhatsappClient = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      whatsappClient = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      });

      whatsappClient.on("qr", (qr: string) => {
        console.log("\n📱 Escanea este QR con tu teléfono:");
        console.log("=====================================================\n");
        qrcode.generate(qr, { small: true });
        console.log("\n=====================================================\n");
      });

      whatsappClient.on("ready", () => {
        isClientReady = true;
        console.log("✅ [WhatsApp] Cliente conectado");
        resolve();
      });

      whatsappClient.on("authenticated", () => {
        console.log("🔐 [WhatsApp] Sesión autenticada");
      });

      whatsappClient.on("auth_failure", (msg: string) => {
        console.error("❌ [WhatsApp] Error de autenticación:", msg);
        isClientReady = false;
        reject(new Error(msg));
      });

      // Desconexión inesperada → reconectar automáticamente
      whatsappClient.on("disconnected", (reason: string) => {
        console.warn(`⚠️ [WhatsApp] Desconectado: ${reason}`);
        isClientReady = false;
        reconnect();
      });

      // Cambios de estado de la sesión (CONFLICT, UNLAUNCHED, etc.)
      whatsappClient.on("change_state", (state: string) => {
        console.log(`📡 [WhatsApp] Estado: ${state}`);
        if (state === "CONFLICT" || state === "UNLAUNCHED") {
          isClientReady = false;
        }
      });

      whatsappClient.on("message", handleIncomingMessage);

      whatsappClient.initialize();

      const timeout = setTimeout(() => {
        reject(new Error("[WhatsApp] Timeout: no se completó la autenticación en 120s"));
      }, 120000);

      whatsappClient.once("ready", () => clearTimeout(timeout));
    } catch (error) {
      console.error("❌ [WhatsApp] Error inicializando:", error);
      reject(error);
    }
  });
};

// ─── Envío de mensajes ────────────────────────────────────────────────────────

export const sendWhatsappMessage = async (
  phone: string,
  message: string
): Promise<boolean> => {
  try {
    if (!whatsappClient || !isClientReady) {
      console.error("❌ [WhatsApp] Cliente no está listo para enviar");
      return false;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      console.error(
        `❌ [WhatsApp] Número inválido: "${phone}" — usa formato internacional (ej: 50372880187)`
      );
      return false;
    }

    const chatId = `${cleanPhone}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
    console.log(`✅ [WhatsApp] Mensaje enviado a ${cleanPhone}`);
    return true;
  } catch (error) {
    // Frame desconectado: marcar como no listo y reconectar
    if (isFrameError(error)) {
      console.warn(
        "⚠️ [WhatsApp] Frame desconectado detectado — iniciando reconexión automática"
      );
      isClientReady = false;
      reconnect();
    } else {
      console.error(`❌ [WhatsApp] Error enviando a ${phone}:`, error);
    }
    return false;
  }
};

// Envía al número administrador definido en WHATSAPP_ADMIN_NUMBER
export const enviarWhatsApp = async (message: string): Promise<boolean> => {
  const adminPhone =
    process.env.WHATSAPP_ADMIN_NUMBER || process.env.WHATSAPP_ADMIN_PHONE;
  if (!adminPhone) {
    console.warn("⚠️ WHATSAPP_ADMIN_NUMBER no está configurado en .env");
    return false;
  }
  return sendWhatsappMessage(adminPhone, message);
};

// ─── Chatbot ──────────────────────────────────────────────────────────────────

async function handleIncomingMessage(message: Message): Promise<void> {
  const body = message.body.trim().toLowerCase();
  // Extraer número limpio del remitente (ej: "50372880187@c.us" → "50372880187")
  const senderPhone = message.from.replace("@c.us", "");

  if (body === "ping") {
    await message.reply("pong 🏓");
    return;
  }

  // Confirmación de pedido por el cliente
  if (body === "si" || body === "sí" || body === "confirmar" || body === "confirmo") {
    await handleConfirmacionPedido(message, senderPhone, true);
    return;
  }

  // Cancelación de pedido por el cliente
  if (body === "no" || body === "cancelar" || body === "cancelo") {
    await handleConfirmacionPedido(message, senderPhone, false);
    return;
  }

  if (body === "stock" || body === "ver stock" || body === "stock bajo") {
    await handleStockQuery(message);
    return;
  }

  if (body === "ayuda" || body === "help" || body === "hola") {
    await message.reply(
      `👋 *Bot Ferretería - Comandos disponibles:*\n\n` +
        `✅ *SI* — Confirmar tu pedido pendiente\n` +
        `❌ *NO* — Cancelar tu pedido pendiente\n` +
        `📦 *stock* — Ver productos con stock bajo\n` +
        `❓ *ayuda* — Mostrar esta ayuda\n\n` +
        `_Sistema de gestión de ferretería_`
    );
    return;
  }
}

async function handleConfirmacionPedido(
  message: Message,
  senderPhone: string,
  confirmar: boolean
): Promise<void> {
  try {
    // Import dinámico para evitar dependencia circular
    const { buscarPedidoPendientePorTelefono, confirmarPedido, cancelarPedido } =
      await import("./pedido.service");

    const pedido = await buscarPedidoPendientePorTelefono(senderPhone);

    if (!pedido) {
      await message.reply(
        "ℹ️ No tienes ningún pedido pendiente de confirmación en este momento."
      );
      return;
    }

    if (confirmar) {
      await confirmarPedido(pedido.id);
      await message.reply(
        `✅ *Pedido #${pedido.id} confirmado*\n\n` +
          `Gracias por confirmar. Procesaremos tu pedido y te avisaremos cuando esté en camino.\n` +
          `💰 Recuerda tener el pago listo: *$${Number(pedido.total).toFixed(2)}* en efectivo.\n\n` +
          `_Ferretería_`
      );
    } else {
      await cancelarPedido(pedido.id);
      await message.reply(
        `❌ *Pedido #${pedido.id} cancelado*\n\n` +
          `Tu pedido fue cancelado. Si fue un error, puedes hacer un nuevo pedido desde nuestra tienda.\n\n` +
          `_Ferretería_`
      );
    }
  } catch (error: any) {
    console.error("❌ [Chatbot] Error procesando confirmación:", error);
    await message.reply(`❌ ${error.message || "Error al procesar tu respuesta. Intenta de nuevo."}`);
  }
}

async function handleStockQuery(message: Message): Promise<void> {
  try {
    // Import dinámico para evitar dependencia circular con prisma en el módulo
    const { prisma } = await import("../config/prisma");

    const productos = await prisma.productos.findMany({
      where: { activo: true },
      select: {
        nombre: true,
        stock: true,
        stock_minimo: true,
        proveedores: { select: { nombre: true } },
      },
    });

    const bajos = productos.filter((p) => p.stock <= p.stock_minimo);

    if (bajos.length === 0) {
      await message.reply("✅ *Todo el stock está en niveles normales.*");
      return;
    }

    const lista = bajos
      .map(
        (p) =>
          `• *${p.nombre}*: ${p.stock}/${p.stock_minimo} uds` +
          (p.proveedores ? ` (${p.proveedores.nombre})` : "")
      )
      .join("\n");

    await message.reply(
      `🚨 *Productos con stock bajo (${bajos.length}):*\n\n${lista}`
    );
  } catch (error) {
    console.error("❌ [Chatbot] Error consultando stock:", error);
    await message.reply("❌ Error al consultar el stock. Intenta de nuevo.");
  }
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

export const getWhatsappStatus = (): { connected: boolean; ready: boolean } => ({
  connected: whatsappClient !== null,
  ready: isClientReady,
});

export const disconnectWhatsapp = async (): Promise<void> => {
  try {
    if (whatsappClient) {
      await whatsappClient.destroy();
      whatsappClient = null;
      isClientReady = false;
      console.log("👋 [WhatsApp] Cliente desconectado");
    }
  } catch (error) {
    console.error("❌ [WhatsApp] Error desconectando:", error);
  }
};

export const formatStockAlertMessage = (
  productName: string,
  currentStock: number,
  minimumStock: number,
  supplierName: string
): string =>
  `
🚨 *ALERTA DE STOCK BAJO* 🚨

📦 *Producto:* ${productName}
📊 *Stock Actual:* ${currentStock} unidades
⚠️ *Stock Mínimo:* ${minimumStock} unidades
🏭 *Proveedor:* ${supplierName}

⏰ Por favor, realiza un pedido urgente.

_Mensaje automático del sistema de ferretería_
`.trim();
