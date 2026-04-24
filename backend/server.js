import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./configs/mongodb.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});
app.get('/clerk', express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhook);

// Initialize connections
let isDBConnected = false;
let isCloudinaryConnected = false;

const initializeConnections = async () => {
  if (!isDBConnected) {
    try {
      await connectDB();
      isDBConnected = true;
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error.message);
    }
  }
  
  if (!isCloudinaryConnected) {
    try {
      await connectCloudinary();
      isCloudinaryConnected = true;
      console.log("✅ Cloudinary Connected");
    } catch (error) {
      console.error("❌ Cloudinary Connection Error:", error.message);
    }
  }
};

// For Vercel serverless
export default async (req, res) => {
  await initializeConnections();
  return app(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  const startServer = async () => {
    try {
      await connectDB();
      await connectCloudinary();
      
      console.log("✅ DB & Cloudinary Connected");
      console.log("CLERK KEY:", process.env.CLERK_SECRET_KEY);
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
      console.error("❌ Startup Error:", error.message);
    }
  };
  
  startServer();
}
