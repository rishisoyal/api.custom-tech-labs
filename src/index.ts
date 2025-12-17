import { config } from "dotenv";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import analyticsRouter from "./routes/analyticsRoutes.js";
import contentRouter from "./routes/contentRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { logger } from "hono/logger";

// load .env file contents into process.env
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

// Logging
app.use("*", (c, next) => {
  console.log("\n---------------------Logger------------------------");
  console.log(`Request made at: ${new Date()}`);
  console.log(`Request method: ${c.req.method}`);
  console.log(`Request endpoint: ${c.req.url}`);
  console.log(`Request origin: ${c.req.header()["origin"]}`);
  console.log("---------------------Logger------------------------\n");
  return next();
});

// Routes
app.route("/api/user", userRouter);
app.route("/api/content", contentRouter);
app.route("/api/analytics", analyticsRouter);

export default app;
