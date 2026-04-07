import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./configs/mongodb.js";
import dns, { setServers } from "dns";
import { clerkWebhooks } from "./controllers/webhooks.js";
//change dns
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// database
await connectDB();

// routes
app.get("/", (req, res) => res.send("API Working 🚀"));
app.post("/clerk", express.json(), clerkWebhooks);

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
