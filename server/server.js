import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import dns from "dns";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";
import checkPlantReminders from "./jobs/reminderJob.js";
import {
  startAIHealthJob,
} from "./jobs/aiHealthJob.js";

import {
  startAIHealthScheduler,
} from "./jobs/aiHealthScheduler.js";

import path from "path";
import { fileURLToPath } from "url";

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
import pointsRoutes from "./routes/pointsRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(clerkMiddleware());



connectDB();


/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "EcoMinds Backend is running 🌱",
  });
});


/* =========================================================
   API ROUTES
========================================================= */

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
app.use("/api/todos", todoRoutes);

app.use(
  "/api/pump-preference",
  pumpPreferenceRoutes
);


/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  if (err.message?.includes("Only JPG")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Image must be smaller than 5MB",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `EcoMinds server running on port ${PORT}`
  );

  startAIHealthJob();

startAIHealthScheduler();
});