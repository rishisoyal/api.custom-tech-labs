import { Hono } from "hono";
import { getContent, postContent } from "../controllers/contentControllers.js";

const contentRouter = new Hono();

contentRouter.get("/", getContent);
contentRouter.post("/", postContent);

export default contentRouter;
