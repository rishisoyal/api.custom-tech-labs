import { Hono } from "hono";
import { userAuth, userLogIn, userLogOut } from "../controllers/userControllers.js";

const userRouter = new Hono();

userRouter.post("/login", userLogIn);
userRouter.delete("/logout", userLogOut);
userRouter.get("/auth", userAuth);

export default userRouter;
