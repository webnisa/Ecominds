import express from "express";

import {
  analyzePlant,
  getLatestPlantHealth,
  getPlantHealthHistory,
} from "../controllers/aiController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// Analyze current plant health
router.post(
  "/analyze/:plantId",
  requireAuth,
  analyzePlant
);


// Latest health result
router.get(
  "/health/:plantId",
  requireAuth,
  getLatestPlantHealth
);


// Health history
router.get(
  "/health-history/:plantId",
  requireAuth,
  getPlantHealthHistory
);


export default router;