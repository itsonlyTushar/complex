import express from "express"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import menuRoutes from "./routes/menu.routes.js"
import courtRoutes from "./routes/court.routes.js"

const app = express();

// Manual CORS middleware (cors@2.8.6 is incompatible with Express 5)
console.log("CORS middleware registered");
app.use((req, res, next) => {
    console.log(`[CORS] ${req.method} ${req.url}`);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api", menuRoutes)
app.use("/api/court", courtRoutes)

export default app;