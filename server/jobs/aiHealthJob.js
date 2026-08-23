import cron from "node-cron";

import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";
import PlantHealth from "../models/PlantHealth.js";

import {
  predictPlantHealth,
} from "../services/aiService.js";

// ============================================================
// JOB INSTANCE
// ============================================================

let aiHealthJob = null;

// ============================================================
// RUN AI HEALTH CHECK
// ============================================================

export const runAIHealthCheck = async () => {
  try {
    console.log(
      "🌱 AI Health Job Started..."
    );

    // ========================================================
    // GET ALL PLANTS
    // ========================================================

    const plants =
      await Plant.find({});

    if (
      !plants ||
      plants.length === 0
    ) {
      console.log(
        "🌱 No plants found."
      );

      return;
    }

    console.log(
      `🌱 Checking ${plants.length} plant(s)...`
    );

    // ========================================================
    // PROCESS EACH PLANT
    // ========================================================

    for (const plant of plants) {
      try {
        console.log(
          `🌱 Checking plant: ${
            plant.plantName
          }`
        );

        // ====================================================
        // LAST 5 DAYS SENSOR DATA
        // ====================================================

        const fiveDaysAgo =
          new Date();

        fiveDaysAgo.setDate(
          fiveDaysAgo.getDate() - 5
        );

        const sensorData =
          await PlantData.find({
            plantId: plant._id,

            recordedAt: {
              $gte: fiveDaysAgo,
            },
          })
            .sort({
              recordedAt: -1,
            })
            .limit(100);

        // ====================================================
        // NO DATA
        // ====================================================

        if (
          !sensorData ||
          sensorData.length === 0
        ) {
          console.log(
            `⚠️ No sensor history for ${plant.plantName}`
          );

          continue;
        }

        console.log(
          `📊 ${sensorData.length} sensor reading(s) found`
        );

        // ====================================================
        // LOG LATEST SENSOR DATA
        // ====================================================

        const latest =
          sensorData[0];

        console.log(
          "📡 Latest sensor data:",
          {
            moisture:
              latest.soilMoisture,

            temperature:
              latest.temperature,

            humidity:
              latest.humidity,

            light:
              latest.light,

            recordedAt:
              latest.recordedAt,
          }
        );

        // ====================================================
        // AI PREDICTION
        // ====================================================

        const result =
          await predictPlantHealth({
            plant,

            sensorData,

            // Care history can be connected later.
            careHistory: [],
          });

        if (!result) {
          console.log(
            `⚠️ No AI result for ${plant.plantName}`
          );

          continue;
        }

        // ====================================================
        // UPDATE PLANT
        // ====================================================

        plant.healthScore =
          result.healthScore;

        plant.health =
          result.status;

        plant.lastHealthCheck =
          new Date();

        plant.healthProblems =
          Array.isArray(
            result.factors
          )
            ? result.factors
                .filter(
                  (item) =>
                    item?.impact ===
                    "negative"
                )
                .map(
                  (item) =>
                    item.factor
                )
            : [];

        plant.healthTips =
          [
            result.recommendation,
            result.sunlightRecommendation,
          ].filter(Boolean);

        plant.aiInsight =
          result.analysis;

        plant.aiRecommendation =
          result.recommendation;

        plant.aiRiskLevel =
          result.riskLevel;

        plant.aiTrend =
          result.trend;

        plant.aiWateringNeeded =
          result.wateringNeeded;

        plant.aiWateringReason =
          result.suggestedWateringReason;

        plant.aiSunlightStatus =
          result.sunlightStatus;

        plant.aiSunlightRecommendation =
          result.sunlightRecommendation;

        await plant.save();

        // ====================================================
        // SAVE PLANT HEALTH HISTORY
        // ====================================================

        await PlantHealth.create({
          userId:
            plant.userId,

          plantId:
            plant._id,

          healthScore:
            result.healthScore,

          status:
            result.status,

          riskLevel:
            result.riskLevel,

          trend:
            result.trend,

          analysis:
            result.analysis,

          recommendation:
            result.recommendation,

          prediction:
            result.prediction,

          wateringNeeded:
            result.wateringNeeded,

          suggestedWateringReason:
            result.suggestedWateringReason,

          sunlightStatus:
            result.sunlightStatus,

          sunlightRecommendation:
            result.sunlightRecommendation,

          factors:
            result.factors,

          dataPointsUsed:
            result.dataPointsUsed,

          generatedAt:
            new Date(),
        });

        console.log(
          `✅ AI health updated: ${plant.plantName}`
        );

        console.log(
          `💚 Score: ${result.healthScore}`
        );

        console.log(
          `💧 Watering needed: ${
            result.wateringNeeded
          }`
        );

        console.log(
          `☀️ Sunlight: ${
            result.sunlightStatus
          }`
        );

      } catch (plantError) {
        console.error(
          `❌ AI health failed for ${
            plant.plantName
          }:`,
          plantError.message
        );

        // One plant fail hone par
        // baaki plants continue honge.
        continue;
      }
    }

    console.log(
      "🌱 AI Health Job Finished."
    );

  } catch (error) {
    console.error(
      "❌ AI Health Job Error:",
      error
    );
  }
};

// ============================================================
// START DAILY JOB
// ============================================================

export const startAIHealthJob = () => {
  if (aiHealthJob) {
    console.log(
      "⚠️ AI Health Job already running."
    );

    return aiHealthJob;
  }

  aiHealthJob =
    cron.schedule(
      "0 9 * * *",

      async () => {
        console.log(
          "⏰ Daily AI plant health check..."
        );

        await runAIHealthCheck();
      },

      {
        timezone:
          "Asia/Kolkata",
      }
    );

  console.log(
    "✅ AI Health Job scheduled — every day at 9:00 AM."
  );

  return aiHealthJob;
};

// ============================================================
// STOP JOB
// ============================================================

export const stopAIHealthJob = () => {
  if (aiHealthJob) {
    aiHealthJob.stop();

    aiHealthJob = null;

    console.log(
      "🛑 AI Health Job stopped."
    );
  }
};