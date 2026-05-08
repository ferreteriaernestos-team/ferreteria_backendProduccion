import { cancelarPedidosExpirados } from "../services/pedido.service";

const INTERVAL_MS = 60 * 1000; // revisa cada minuto

export const iniciarJobExpiracionPedidos = (): void => {
  console.log("⏰ [PedidosJob] Monitor de expiración iniciado (revisión cada 60s)");

  setInterval(async () => {
    try {
      const cancelados = await cancelarPedidosExpirados();
      if (cancelados > 0) {
        console.log(`⏰ [PedidosJob] ${cancelados} pedido(s) expirados cancelados automáticamente`);
      }
    } catch (error) {
      console.error("❌ [PedidosJob] Error al cancelar pedidos expirados:", error);
    }
  }, INTERVAL_MS);
};
