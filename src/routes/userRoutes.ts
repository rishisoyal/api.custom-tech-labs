import { Hono } from "hono";
import { userAuthentication, userLogIn, userLogOut } from "../controllers/userControllers.js";

const userRouter = new Hono();

userRouter.post("/login", userLogIn);
userRouter.delete("/logout", userLogOut);
userRouter.get("/auth", userAuthentication);

export default userRouter;
