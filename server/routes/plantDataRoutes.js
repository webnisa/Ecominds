import express from "express";

import {
  addPlantData,
  getPlantDataHistory,
} from "../controllers/plantDataController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ESP32 / authenticated device
router.post(
  "/",
  requireAuth,
  addPlantData
);


// Frontend graph
router.get(
  "/:plantId",
  requireAuth,
  getPlantDataHistory
);


export default router;