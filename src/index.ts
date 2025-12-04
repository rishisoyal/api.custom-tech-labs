import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import analyticsRouter from "./routes/analyticsRoutes.js";
import contentRouter from "./routes/contentRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { serve } from "@hono/node-server";


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
    origin: (origin) => {
      if (!origin) return "*";
      if (allowedOrigins.includes(origin)) return origin;
      return ""; // block
    },
    credentials: true,
  })
);

// Routes
app.route("/api/user", userRouter);
app.route("/api/content", contentRouter);
app.route("/api/analytics", analyticsRouter);

// dev server (using bun)
if (process.env.NODE_ENV === "development") {
  serve(app);
}

export default app;
