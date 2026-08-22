import Reminder from "../models/Reminder.js";
import Plant from "../models/Plant.js";


// ==========================================
// CREATE ACTIONS FROM AI RESULT
// ==========================================

export const createHealthActions = async ({
  userId,
  plantId,
  healthResult,
}) => {

  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  });

  if (!plant) {
    throw new Error("Plant not found");
  }


  const reminders = [];


  // ==========================================
  // LOW MOISTURE
  // ==========================================

  if (
    healthResult.healthStatus === "critical" ||
    healthResult.riskLevel === "high"
  ) {

    const existingReminder =
      await Reminder.findOne({
        userId,
        plantId,
        type: "ai_health_warning",
        isRead: false,
      });


    if (!existingReminder) {

      const reminder =
        await Reminder.create({

          userId,

          plantId,

          type: "ai_health_warning",

          title:
            "Your plant needs attention 🌱",

          message:
            healthResult.recommendation,

          priority: "high",

          isRead: false,

        });


      reminders.push(reminder);
    }
  }


  // ==========================================
  // WATERING REQUIRED
  // ==========================================

  if (
    healthResult.prediction
      ?.toLowerCase()
      .includes("water")
  ) {

    const existingReminder =
      await Reminder.findOne({

        userId,

        plantId,

        type: "water_required",

        isRead: false,

      });


    if (!existingReminder) {

      const reminder =
        await Reminder.create({

          userId,

          plantId,

          type: "water_required",

          title:
            `${plant.plantName} may need water 💧`,

          message:
            healthResult.recommendation,

          priority: "high",

          isRead: false,

        });


      reminders.push(reminder);
    }
  }


  return reminders;
};