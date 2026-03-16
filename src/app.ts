import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./config/swagger";
import ventaRoutes from "./routes/venta.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { iniciarMonitorStock } from "./jobs/stock-monitor.job";
import inventarioRoutes from "./routes/inventario.routes";
import ordenCompraRoutes from "./routes/orden_compra.routes";


import movimientoRoutes from "./routes/movimiento.routes";

import reporteRoutes from "./routes/reporte.routes";

import productRoutes from "./routes/product.routes";
import cajaRoutes from "./routes/caja.routes";
import { ROUTE_PATHS, DEFAULTS } from "./constants";
import proveedorRoutes from "./routes/proveedor.routes";


const app = express();

app.disable("etag");

app.use(cors());
app.use(helmet());
app.use(morgan(DEFAULTS.MORGAN_FORMAT));
app.use(express.json());

app.use(ROUTE_PATHS.AUTH, authRoutes);

app.use(ROUTE_PATHS.PRODUCTS, productRoutes);

app.use(ROUTE_PATHS.MOVEMENTS, movimientoRoutes);

app.use(ROUTE_PATHS.SALES, ventaRoutes);

app.use(ROUTE_PATHS.BOX, cajaRoutes);
app.use(ROUTE_PATHS.REPORTS, reporteRoutes);

app.use("/api/dashboard", dashboardRoutes);
iniciarMonitorStock();app.use("/api/inventario", inventarioRoutes)
app.use("/api/proveedores", proveedorRoutes);

app.use("/api/ordenes-compra", ordenCompraRoutes);



// 🔥 ESTA LÍNEA ES CLAVE
setupSwagger(app);






export default app;


