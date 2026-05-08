import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./config/swagger";
import ventaRoutes from "./routes/venta.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { iniciarMonitorStock } from "./jobs/stock-monitor.job";
import { iniciarJobAlertasStock } from "./jobs/stockAlert.job";
import { initializeWhatsappClient } from "./services/whatsapp.service";
import inventarioRoutes from "./routes/inventario.routes";
import ordenCompraRoutes from "./routes/orden_compra.routes";
import movimientoRoutes from "./routes/movimiento.routes";
import reporteRoutes from "./routes/reporte.routes";
import productRoutes from "./routes/product.routes";
import cajaRoutes from "./routes/caja.routes";
import proveedorRoutes from "./routes/proveedor.routes";
import categoriaRoutes from "./routes/categoria.routes";
import clienteRoutes from "./routes/cliente.routes";
import descuentoRoutes from "./routes/descuento.routes";
import pedidoRoutes from "./routes/pedido.routes";
import carritoRoutes from "./routes/carrito.routes";
import { iniciarJobExpiracionPedidos } from "./jobs/pedido-expiry.job";
import { ROUTE_PATHS, DEFAULTS } from "./constants";

const app = express();

app.disable("etag");

app.use(cors());
app.use(helmet());
app.use(morgan(DEFAULTS.MORGAN_FORMAT));
app.use(express.json());

// Auth
app.use(ROUTE_PATHS.AUTH, authRoutes);

// Productos y catálogo
app.use(ROUTE_PATHS.PRODUCTS, productRoutes);
app.use("/api/categorias", categoriaRoutes);

// Clientes y descuentos
app.use("/api/clientes", clienteRoutes);
app.use("/api/descuentos", descuentoRoutes);

// Pedidos online y carrito (clientes)
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/carrito", carritoRoutes);

// Ventas y caja
app.use(ROUTE_PATHS.SALES, ventaRoutes);
app.use(ROUTE_PATHS.BOX, cajaRoutes);

// Inventario y movimientos
app.use(ROUTE_PATHS.MOVEMENTS, movimientoRoutes);
app.use("/api/inventario", inventarioRoutes);

// Proveedores y órdenes de compra
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/ordenes-compra", ordenCompraRoutes);

// Reportes y dashboard
app.use(ROUTE_PATHS.REPORTS, reporteRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Jobs automáticos
iniciarMonitorStock();
iniciarJobAlertasStock();
iniciarJobExpiracionPedidos();

// WhatsApp
initializeWhatsappClient().catch((error) => {
  console.error("⚠️ Error inicializando WhatsApp:", error.message);
  console.log("⚠️ El sistema continuará funcionando, pero no enviará alertas por WhatsApp");
});

setupSwagger(app);

export default app;
