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
    mongoose
      .connect(process.env.MONGODB_URI!, {
        dbName: "company_website",
      })
      .then(() => {
        console.log("-----------------------");
        console.log("connected to database");
        console.log("-----------------------");
      })
      .catch((error) => {
        console.error("-----------------------");
        console.error("could not connect to database\n" + error);
        console.error("-----------------------");
      });
    isConnected = true;
  }
}
