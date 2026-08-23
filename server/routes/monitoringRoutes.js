import express from "express";

import {
  getPlantMonitoring,
  addSensorData,
} from "../controllers/monitoringController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================================
// GET MONITORING HISTORY
// ============================================================

router.get(
  "/:plantId",
  requireAuth,
  getPlantMonitoring
);


// ============================================================
// ADD SENSOR DATA
// ============================================================

router.post(
  "/sensor",
  requireAuth,
  addSensorData
);


export default router;