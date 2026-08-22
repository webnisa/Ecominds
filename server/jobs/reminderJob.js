import cron from "node-cron";
import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";
import CareHistory from "../models/CareHistory.js";
import Reminder from "../models/Reminder.js";

const checkPlantReminders = async () => {
  try {
    console.log("🌱 Checking plant conditions...");

    const plants = await Plant.find({});

    let createdCount = 0;

    for (const plant of plants) {
      const userId = plant.userId;

      // -----------------------------
      // Latest sensor data
      // -----------------------------

      const latestData = await PlantData.findOne({
        plantId: plant._id,
        userId,
      }).sort({
        recordedAt: -1,
      });

      if (latestData) {

        // LOW MOISTURE
        if (
          latestData.soilMoisture !== undefined &&
          latestData.soilMoisture < 20
        ) {
          const exists = await Reminder.findOne({
            userId,
            plantId: plant._id,
            type: "low_moisture",
            isRead: false,
          });

          if (!exists) {
            await Reminder.create({
              userId,
              plantId: plant._id,
              type: "low_moisture",
              title: "Your plant may need water 💧",
              message: `${plant.plantName} has very low soil moisture.`,
              priority: "high",
            });

            createdCount++;
          }
        }

        // OVERWATERING
        if (
          latestData.soilMoisture !== undefined &&
          latestData.soilMoisture > 85
        ) {
          const exists = await Reminder.findOne({
            userId,
            plantId: plant._id,
            type: "overwatering",
            isRead: false,
          });

          if (!exists) {
            await Reminder.create({
              userId,
              plantId: plant._id,
              type: "overwatering",
              title: "Possible overwatering ⚠️",
              message: `${plant.plantName} has very high soil moisture.`,
              priority: "high",
            });

            createdCount++;
          }
        }

        // HIGH TEMPERATURE
        if (
          latestData.temperature !== undefined &&
          latestData.temperature > 40
        ) {
          const exists = await Reminder.findOne({
            userId,
            plantId: plant._id,
            type: "high_temperature",
            isRead: false,
          });

          if (!exists) {
            await Reminder.create({
              userId,
              plantId: plant._id,
              type: "high_temperature",
              title: "High temperature detected 🌡️",
              message: `${plant.plantName} is experiencing high temperature.`,
              priority: "medium",
            });

            createdCount++;
          }
        }

        // LOW HUMIDITY
        if (
          latestData.humidity !== undefined &&
          latestData.humidity < 25
        ) {
          const exists = await Reminder.findOne({
            userId,
            plantId: plant._id,
            type: "low_humidity",
            isRead: false,
          });

          if (!exists) {
            await Reminder.create({
              userId,
              plantId: plant._id,
              type: "low_humidity",
              title: "Low humidity detected 💨",
              message: `${plant.plantName} has low humidity.`,
              priority: "medium",
            });

            createdCount++;
          }
        }
      }


      // -----------------------------
      // Missed care check
      // -----------------------------

      const lastCare = await CareHistory.findOne({
        userId,
        plantId: plant._id,
      }).sort({
        performedAt: -1,
      });

      if (lastCare) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const lastCareDate = new Date(
          lastCare.performedAt
        );

        lastCareDate.setHours(0, 0, 0, 0);

        const daysSinceCare =
          (today - lastCareDate) /
          (1000 * 60 * 60 * 24);

        if (daysSinceCare >= 1) {

          const exists = await Reminder.findOne({
            userId,
            plantId: plant._id,
            type: "care_missed",
            isRead: false,
          });

          if (!exists) {
            await Reminder.create({
              userId,
              plantId: plant._id,
              type: "care_missed",
              title: "Don't forget your plant 🌱",
              message: `${plant.plantName} has not been cared for today.`,
              priority: "medium",
            });

            createdCount++;
          }
        }
      }
    }

    console.log(
      `✅ Reminder check completed. Created: ${createdCount}`
    );

  } catch (error) {
    console.error(
      "❌ Automatic reminder error:",
      error
    );
  }
};


// ==========================================
// RUN EVERY DAY AT 9:00 AM
// ==========================================

cron.schedule(
  "0 9 * * *",
  () => {
    checkPlantReminders();
  },
  {
    timezone: "Asia/Kolkata",
  }
);


export default checkPlantReminders;