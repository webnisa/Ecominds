import express from "express";

import {
  receiveSensorData,
  getLatestSensorData,
  getSensorHistory,
} from "../controllers/sensorController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// RECEIVE SENSOR DATA
// ==========================================

router.post(
  "/data",
  requireAuth,
  receiveSensorData
);


// ==========================================
// LATEST SENSOR DATA
// ==========================================

router.get(
  "/latest/:plantId",
  requireAuth,
  getLatestSensorData
);


// ==========================================
// SENSOR HISTORY
// ==========================================

router.get(
  "/history/:plantId",
  requireAuth,
  getSensorHistory
);


export default router;