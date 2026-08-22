import express from "express";

import {
  addPlant,
  getPlants,
  getPlant,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// ADD PLANT
// ==========================================

router.post(
  "/",
  requireAuth,
  addPlant
);


// ==========================================
// GET ALL PLANTS
// ==========================================

router.get(
  "/",
  requireAuth,
  getPlants
);


// ==========================================
// GET ONE PLANT
// ==========================================

router.get(
  "/:plantId",
  requireAuth,
  getPlant
);


// ==========================================
// UPDATE PLANT
// ==========================================

router.put(
  "/:plantId",
  requireAuth,
  updatePlant
);


// ==========================================
// DELETE PLANT
// ==========================================

router.delete(
  "/:plantId",
  requireAuth,
  deletePlant
);


export default router;