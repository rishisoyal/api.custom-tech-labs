import { Hono } from "hono";
import { getGeneralStats, getRealTimeAnalytics, getMetrics } from "../controllers/analyticsController.js";

const analyticsRouter = new Hono()

analyticsRouter.get("/realtime", getRealTimeAnalytics);
analyticsRouter.get("/stats", getGeneralStats);
analyticsRouter.get("/metrics", getMetrics);

export default analyticsRouter