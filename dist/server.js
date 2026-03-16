"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./prisma"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// health check endpoint that verifies DB connectivity
app_1.default.get("/health", async (_req, res) => {
    try {
        // Try a lightweight DB call - count on a table that exists in schema
        const count = await prisma_1.default.usuarios.count();
        return res.json({ ok: true, usuarios: count });
    }
    catch (err) {
        console.error("DB health check failed:", err);
        return res.status(503).json({ ok: false, error: String(err) });
    }
});
async function start() {
    try {
        await prisma_1.default.$connect();
        app_1.default.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}
start();
