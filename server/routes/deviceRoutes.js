import express from "express";

import {
  registerDevice,
  deviceHeartbeat,
  getMyDevices,
  getPendingPumpCommand,
  completePumpCommand,
} from "../controllers/deviceController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

import {
  deviceAuth,
} from "../middleware/deviceAuthMiddleware.js";


const router = express.Router();


// ==========================================
// USER ROUTES
// Clerk authentication
// ==========================================


// Register ESP32
router.post(
  "/register",
  requireAuth,
  registerDevice
);


// Get user's devices
router.get(
  "/",
  requireAuth,
  getMyDevices
);


// ==========================================
// ESP32 ROUTES
// Device API Key authentication
// ==========================================


// ESP32 heartbeat
router.post(
  "/heartbeat",
  deviceAuth,
  deviceHeartbeat
);


// ESP32 asks for pump command
router.get(
  "/:deviceId/pump-command",
  deviceAuth,
  getPendingPumpCommand
);


// ESP32 tells backend command completed
router.post(
  "/pump-command/complete",
  deviceAuth,
  completePumpCommand
);


export default router;