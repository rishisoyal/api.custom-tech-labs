import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import analyticsRouter from "./routes/analyticsRoutes.js";
import contentRouter from "./routes/contentRoutes.js";
import userRouter from "./routes/userRoutes.js";

config();

// ------------------------------
// Hono App
// ------------------------------
const app = new Hono();

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.route("/api/user", userRouter);
app.route("/api/content", contentRouter);
app.route("/api/analytics", analyticsRouter);

export default app;
