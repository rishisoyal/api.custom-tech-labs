import { decodeJwt, SignJWT } from "jose";
import { Context } from "hono";
import User from "../models/UserModel.js";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import connectDB from "../lib/mongoDB.js";
import { compare } from "bcrypt";
import mongoose from "mongoose";

// cache the secret
const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);

// post
export async function userLogIn(c: Context) {
  const body = await c.req.json();
  const { name, password } = body;

  if (!name || !password) {
    return c.json({ error: "Missing credentials" }, 400);
  }

  await connectDB();
  const user = await User.findOne({ name });
  if (!user) return c.json({ error: "User not found" }, 401);

  const valid = await compare(password, user.password_hash);
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const token = await new SignJWT({
    uid: user._id!.toString(),
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2d")
    .sign(SECRET);

  const isProd = process.env.NODE_ENV === "production";

  setCookie(c, "auth_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 2 * 24 * 60 * 60, // 2 days
  });

  return c.json({ message: "success" }, 200);
}

// delete
export async function userLogOut(c: Context) {
  const token = getCookie(c, "auth_token");

  if (!token) return c.json({ error: "Token not found" }, 401);

  deleteCookie(c, "auth_token", { path: "/" });

  return c.json({ message: "logged out" }, 200);
}

export async function userAuthentication(c: Context) {
  const token = getCookie(c, "auth_token");
  if (!token) return c.json({ error: "Token not found" }, 401);
  const payload = decodeJwt(token);
  if (!payload.uid || !payload.role)
    return c.json(
      {
        message: "user not found",
      },
      401
    );

  await connectDB();
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(payload.uid as string),
  });
  if (!user) return c.json({ error: "User not found" }, 401);
  return c.json(
    {
      message: "valid user",
    },
    202
  );
}
