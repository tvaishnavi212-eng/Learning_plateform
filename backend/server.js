import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// fix DNS (ok to keep)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ FIX: DB connection (serverless safe)
let isConnected = false;

const connect = async () => {
  if (isConnected) return;
  const db = await connectDB();
  isConnected = true;
};

// routes
app.get("/", async (req, res) => {
  await connect();
  res.send("API Working 🚀");
});

app.post("/clerk", async (req, res) => {
  await connect();
  return clerkWebhooks(req, res);
});

// ✅ EXPORT THIS
export default app;
