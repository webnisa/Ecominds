import express from "express";

import {
  getMyProfile,
} from "../controllers/userController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
  "/profile",
  requireAuth,
  getMyProfile
);


export default router;