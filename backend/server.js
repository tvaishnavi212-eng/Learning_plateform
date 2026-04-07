import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ DB connection (SAFE)
let isConnected = false;

const connect = async () => {
  try {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    throw error; // important
  }
};

// routes
app.get("/", async (req, res) => {
  try {
    await connect();
    res.send("API Working 🚀");
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/clerk", async (req, res) => {
  try {
    await connect();
    return clerkWebhooks(req, res);
  } catch (error) {
    res.status(500).json({ error: "Webhook Error" });
  }
});

// ✅ EXPORT
export default app;
