import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import analyticsRouter from "./routes/analyticsRoute";
import contentRouter from "./routes/contentRoutes";
import userRouter from "./routes/userRoutes";

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

// dev server # TODO
export default app;
