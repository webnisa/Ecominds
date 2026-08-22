import express from "express";

import {
  getPlantHealthHistory,
} from "../controllers/healthController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// GET HEALTH HISTORY
// ==========================================

router.get(
  "/:plantId",
  requireAuth,
  getPlantHealthHistory
);


export default router;