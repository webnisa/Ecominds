import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";
import checkPlantReminders from "./jobs/reminderJob.js";

import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import careRoutes from "./routes/careRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import plantDataRoutes from "./routes/plantDataRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import pumpRoutes from "./routes/pumpRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import pumpPreferenceRoutes from "./routes/pumpPreferenceRoutes.js";
import { startAIHealthJob } from "./jobs/aiHealthJob.js";
import pointsRoutes from "./routes/pointsRoutes.js";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "EcoMinds Backend is running 🌱",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/care", careRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/plant-data", plantDataRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/pump", pumpRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/pump-preference", pumpPreferenceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EcoMinds server running on port ${PORT}`);

  startAIHealthJob();
});
