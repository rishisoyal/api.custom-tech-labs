import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

// ------------------------------
// MongoDB Connection
// ------------------------------
let isConnected = false;
export default async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "company_website",
    });
    isConnected = true;
  }
}
