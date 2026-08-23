// server/jobs/aiHealthJob.js

import cron from "node-cron";
import Plant from "../models/Plant.js";
import {
  analyzePlantHealth,
} from "../services/plantHealthService.js";

/*
|--------------------------------------------------------------------------
| AI HEALTH JOB
|--------------------------------------------------------------------------
| Ye background job plants ki saved sensor history ko check karega.
|
| IMPORTANT:
| Ye tumhare image-upload AI ko replace nahi karta.
| Image analysis /api/ai/analyze-image independently chalega.
|--------------------------------------------------------------------------
*/

let aiHealthJob = null;

/*
|--------------------------------------------------------------------------
| Run AI Health Check
|--------------------------------------------------------------------------
*/

export const runAIHealthCheck = async () => {
  try {
    console.log("🌱 AI Health Job Started...");

    const plants = await Plant.find({});

    if (!plants || plants.length === 0) {
      console.log("🌱 No plants found for AI health check.");
      return;
    }

    console.log(`🌱 Checking ${plants.length} plant(s)...`);

    for (const plant of plants) {
      try {
        /*
         * Sensor data available ho to AI health analysis.
         * Agar sensor history abhi nahi hai to plant skip hoga.
         */

        const sensorData = {
          moisture: plant.moisture ?? null,
          temperature: plant.temperature ?? null,
          humidity: plant.humidity ?? null,
          nutrients: plant.nutrients ?? null,
        };

        const hasSensorData = Object.values(sensorData).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value !== ""
        );

        if (!hasSensorData) {
          console.log(
            `⚠️ No sensor data for plant: ${plant.name}`
          );

          continue;
        }

        const result = await analyzePlantHealth({
          plant,
          sensorData,
        });

        if (!result) {
          console.log(
            `⚠️ No AI result for: ${plant.name}`
          );

          continue;
        }

        /*
         * Save AI result if fields exist.
         */

        if (result.healthScore !== undefined) {
          plant.healthScore = result.healthScore;
        }

        if (result.healthStatus) {
          plant.health = result.healthStatus;
        }

        if (result.overallRecommendation) {
          plant.aiInsight =
            result.overallRecommendation;
        }

        await plant.save();

        console.log(
          `✅ AI health updated: ${plant.name}`
        );
      } catch (plantError) {
        console.error(
          `❌ AI health failed for ${plant.name}:`,
          plantError.message
        );

        // One plant fail hone par baaki plants continue honge.
        continue;
      }
    }

    console.log("🌱 AI Health Job Finished.");
  } catch (error) {
    console.error(
      "❌ AI Health Job Error:",
      error
    );
  }
};

/*
|--------------------------------------------------------------------------
| START JOB
|--------------------------------------------------------------------------
|
| Every day at 9:00 AM.
|
*/

export const startAIHealthJob = () => {
  if (aiHealthJob) {
    console.log(
      "⚠️ AI Health Job already running."
    );

    return aiHealthJob;
  }

  aiHealthJob = cron.schedule(
    "0 9 * * *",
    async () => {
      console.log(
        "⏰ Daily AI plant health check..."
      );

      await runAIHealthCheck();
    }
  );

  console.log(
    "✅ AI Health Job scheduled — every day at 9:00 AM."
  );

  return aiHealthJob;
};

/*
|--------------------------------------------------------------------------
| OPTIONAL STOP FUNCTION
|--------------------------------------------------------------------------
*/

export const stopAIHealthJob = () => {
  if (aiHealthJob) {
    aiHealthJob.stop();
    aiHealthJob = null;

    console.log(
      "🛑 AI Health Job stopped."
    );
  }
};