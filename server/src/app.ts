import express from "express"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import menuRoutes from "./routes/menu.routes.js"
import courtRoutes from "./routes/court.routes.js"
import tableRoutes from "./routes/tables.routes.js"
import orderRoutes from "./routes/order.routes.js"
import paymentsRoutes from "./routes/payments.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import { stripeWebhookController } from "./controllers/payments/payments.controller.js"

const app = express();

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
    const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        clientUrl
    ].filter(Boolean);

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        res.setHeader("Access-Control-Allow-Origin", clientUrl || "http://localhost:3000");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");


    // Handle preflight
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

app.post("/api/payments/webhook", express.raw({
    type: "application/json"
}), stripeWebhookController)

app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api", menuRoutes)
app.use("/api/court", courtRoutes)
app.use("/api", tableRoutes)
app.use("/api", orderRoutes)
app.use("/api/payments", paymentsRoutes)
app.use("/api/dashboard", dashboardRoutes)


export default app;
