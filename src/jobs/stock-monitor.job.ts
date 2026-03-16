import cron from "node-cron";
import { verificarStockCritico } from "../services/stock-alert.service";

export const iniciarMonitorStock = () => {
  // Ejecutar todos los días a las 7am
  cron.schedule("0 7 * * *", async () => {
    console.log("🔎 Verificando stock crítico...");
    await verificarStockCritico();
  });
};