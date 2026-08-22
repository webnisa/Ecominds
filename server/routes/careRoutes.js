import express from "express";

import {
  addCare,
  getCareHistory,
} from "../controllers/careController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// ADD CARE
// ==========================================

router.post(
  "/",
  requireAuth,
  addCare
);


// ==========================================
// GET CARE HISTORY
// ==========================================

router.get(
  "/:plantId",
  requireAuth,
  getCareHistory
);

export default router;