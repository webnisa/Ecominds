import cron from "node-cron";

import {
  runAIHealthCheck,
} from "./aiHealthJob.js";

// ============================================================
// DAILY AI HEALTH SCHEDULER
// ============================================================

let schedulerStarted = false;

export function startAIHealthScheduler() {
  if (schedulerStarted) {
    console.log(
      "⚠️ AI Health Scheduler already started."
    );

    return;
  }

  schedulerStarted = true;

  console.log(
    "⏰ AI Health Scheduler started."
  );

  // Every day at 11:55 PM
  cron.schedule(
    "55 23 * * *",

    async () => {
      console.log(
        "⏰ Daily health monitoring time reached."
      );

      await runAIHealthCheck();
    },

    {
      timezone:
        "Asia/Kolkata",
    }
  );
}