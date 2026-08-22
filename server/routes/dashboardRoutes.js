import express from "express";

import {
  getDashboardSummary,
} from "../controllers/dashboardController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// GET DASHBOARD
// ==========================================

router.get(
  "/",
  requireAuth,
  getDashboardSummary
);


export default router;