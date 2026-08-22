import express from "express";

import {
  requestPump,
  getPumpHistory,
} from "../controllers/pumpController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// User requests pump
router.post(
  "/",
  requireAuth,
  requestPump
);


// Get pump history
router.get(
  "/:plantId",
  requireAuth,
  getPumpHistory
);


export default router;