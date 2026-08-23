import express from "express";

import {
  getAllPlantsMonitoring,
  getPlantMonitoring,
  addSensorData,
} from "../controllers/monitoringController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================================
// GET ALL PLANTS MONITORING
// GET /api/monitoring
// ============================================================

router.get(
  "/",
  requireAuth,
  getAllPlantsMonitoring
);


// ============================================================
// GET SINGLE PLANT MONITORING
// GET /api/monitoring/:plantId
// ============================================================

router.get(
  "/:plantId",
  requireAuth,
  getPlantMonitoring
);


// ============================================================
// ADD SENSOR DATA
// POST /api/monitoring/sensor
// ============================================================

router.post(
  "/sensor",
  requireAuth,
  addSensorData
);


export default router;