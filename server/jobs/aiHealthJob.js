import cron from "node-cron";

import Plant from "../models/Plant.js";
import HealthHistory from "../models/HealthHistory.js";

import {
  analyzePlantHealth,
} from "../services/plantHealthService.js";

import {
  createHealthActions,
} from "../services/aiActionService.js";


// ==========================================
// DAILY AI HEALTH ANALYSIS
// ==========================================

export const startAIHealthJob = () => {

  // Runs every day at 11:55 PM
  cron.schedule("55 23 * * *", async () => {

    console.log(
      "🤖 Daily AI plant health analysis started..."
    );


    try {

      const plants =
        await Plant.find({});


      console.log(
        `🌱 Found ${plants.length} plants`
      );


      for (const plant of plants) {

        try {

          // ==========================================
          // ANALYZE PLANT
          // ==========================================

          const result =
            await analyzePlantHealth({

              userId:
                plant.userId,

              plantId:
                plant._id,

            });


          // ==========================================
          // SAVE HEALTH HISTORY
          // ==========================================

          const health =
            await HealthHistory.create({

              userId:
                plant.userId,

              plantId:
                plant._id,

              healthScore:
                result.healthScore,

              healthStatus:
                result.healthStatus,

              riskLevel:
                result.riskLevel,

              prediction:
                result.prediction,

              recommendation:
                result.recommendation,

              analysis:
                result.analysis,

              sensorSummary:
                result.sensorSummary,

              analyzedAt:
                new Date(),

            });


          // ==========================================
          // CREATE REMINDERS
          // ==========================================

          const reminders =
            await createHealthActions({

              userId:
                plant.userId,

              plantId:
                plant._id,

              healthResult:
                result,

            });


          console.log(
            `✅ ${plant.plantName} analyzed | Score: ${result.healthScore}`
          );


          if (reminders.length > 0) {

            console.log(
              `🔔 ${reminders.length} reminder(s) created`
            );

          }


        } catch (plantError) {

          console.error(
            `❌ Failed to analyze plant ${plant._id}:`,
            plantError.message
          );

        }

      }


      console.log(
        "🤖 Daily AI health analysis completed."
      );


    } catch (error) {

      console.error(
        "❌ AI health job error:",
        error
      );

    }

  });

  console.log(
    "⏰ Daily AI health job scheduled."
  );
};