import app from "../src/index";

export const config = {
  runtime: "edge", // forces Edge Function
};

export default app.fetch;
