import cron from "node-cron";
import { runAIHealthCheck } from "./aiHealthJob.js";


// ============================================================
// DAILY HEALTH MONITORING
// Runs every day at 11:55 PM
// ============================================================

export function startAIHealthScheduler() {

  console.log(
    "⏰ AI Health Scheduler started."
  );


  cron.schedule(
    "55 23 * * *",
    async () => {

      console.log(
        "⏰ Daily health monitoring time reached."
      );

      await runAIHealthCheck();

    },
    {
      timezone: "Asia/Kolkata",
    }
  );
}