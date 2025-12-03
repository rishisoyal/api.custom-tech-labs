import { Hono } from "hono";
import { userLogIn, userLogOut } from "../controllers/userControllers.js";

const userRouter = new Hono();

userRouter.post("/login", userLogIn);
userRouter.delete("/logout", userLogOut);

export default userRouter;
