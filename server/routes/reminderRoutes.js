import express from "express";

import {
  generateReminders,
  getReminders,
  markReminderRead,
} from "../controllers/reminderController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.post(
  "/generate",
  requireAuth,
  generateReminders
);


router.get(
  "/",
  requireAuth,
  getReminders
);


router.patch(
  "/:reminderId/read",
  requireAuth,
  markReminderRead
);


export default router;