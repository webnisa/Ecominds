import express from "express";

import {
  getReminders,
  getUnreadReminderCount,
  markReminderRead,
  markAllRemindersRead,
  createReminder,
  completeReminder,
  
} from "../controllers/reminderController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL REMINDERS
router.get(
  "/",
  requireAuth,
  getReminders
);

// GET UNREAD COUNT
router.get(
  "/unread-count",
  requireAuth,
  getUnreadReminderCount
);

// CREATE REMINDER
router.post(
  "/",
  requireAuth,
  createReminder
);

// MARK ALL READ
router.patch(
  "/read-all",
  requireAuth,
  markAllRemindersRead
);

// MARK ONE READ
router.patch(
  "/:id/read",
  requireAuth,
  markReminderRead
);

// MARK REMINDER AS COMPLETED

router.patch(
  "/:id/complete",
  requireAuth,
  completeReminder
);

export default router;