import express from "express";

import {
  getPumpPreference,
  updatePumpPreference,
} from "../controllers/pumpPreferenceController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
  "/",
  requireAuth,
  getPumpPreference
);


router.put(
  "/",
  requireAuth,
  updatePumpPreference
);


export default router;