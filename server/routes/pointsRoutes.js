import express from "express";

import {
  getMyPoints,
} from "../controllers/pointsController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
  "/",
  requireAuth,
  getMyPoints
);


export default router;