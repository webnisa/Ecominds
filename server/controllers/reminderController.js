import Reminder from "../models/Reminder.js";
import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";
import CareHistory from "../models/CareHistory.js";


// ==========================================
// GENERATE REMINDERS
// ==========================================

export const generateReminders = async (req, res) => {
  try {
    const clerkId = req.userId;

    const plants = await Plant.find({
      userId: clerkId,
    });

    const createdReminders = [];

    for (const plant of plants) {

      const latestData =
        await PlantData.findOne({
          plantId: plant._id,
          userId: clerkId,
        }).sort({
          recordedAt: -1,
        });


      if (!latestData) {
        continue;
      }


      const conditions = [];


      // ==========================================
      // LOW MOISTURE
      // ==========================================

      if (
        latestData.soilMoisture !== undefined &&
        latestData.soilMoisture < 20
      ) {

        conditions.push({
          type: "low_moisture",

          title:
            "Your plant needs water 💧",

          message:
            `${plant.plantName} has very low soil moisture. Check the plant and water it if needed.`,

          priority: "high",
        });

      }


      // ==========================================
      // OVERWATERING
      // ==========================================

      if (
        latestData.soilMoisture !== undefined &&
        latestData.soilMoisture > 85
      ) {

        conditions.push({
          type: "overwatering",

          title:
            "Possible overwatering ⚠️",

          message:
            `${plant.plantName} has very high soil moisture. Avoid watering for now and check drainage.`,

          priority: "high",
        });

      }


      // ==========================================
      // HIGH TEMPERATURE
      // ==========================================

      if (
        latestData.temperature !== undefined &&
        latestData.temperature > 40
      ) {

        conditions.push({
          type: "high_temperature",

          title:
            "High temperature detected 🌡️",

          message:
            `${plant.plantName} is experiencing high temperature conditions.`,

          priority: "medium",
        });

      }


      // ==========================================
      // LOW HUMIDITY
      // ==========================================

      if (
        latestData.humidity !== undefined &&
        latestData.humidity < 25
      ) {

        conditions.push({
          type: "low_humidity",

          title:
            "Low humidity detected 💨",

          message:
            `${plant.plantName} is currently in low humidity conditions.`,

          priority: "medium",
        });

      }


      // ==========================================
      // MISSED CARE
      // ==========================================

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );


      const lastCare =
        await CareHistory.findOne({
          userId: clerkId,
          plantId: plant._id,
        }).sort({
          performedAt: -1,
        });


      if (lastCare) {

        const lastCareDate =
          new Date(
            lastCare.performedAt
          );

        lastCareDate.setHours(
          0,
          0,
          0,
          0
        );


        const difference =
          Math.floor(
            (
              today -
              lastCareDate
            ) /
              (1000 * 60 * 60 * 24)
          );


        if (difference >= 1) {

          conditions.push({
            type: "care_missed",

            title:
              "Don't forget your plant 🌱",

            message:
              `${plant.plantName} has not been cared for today.`,

            priority: "medium",
          });

        }
      }


      // ==========================================
      // CREATE REMINDERS
      // ==========================================

      for (const condition of conditions) {

        const existingReminder =
          await Reminder.findOne({
            userId: clerkId,
            plantId: plant._id,
            type: condition.type,
            isRead: false,
          });


        if (existingReminder) {
          continue;
        }


        const reminder =
          await Reminder.create({

            userId: clerkId,

            plantId:
              plant._id,

            type:
              condition.type,

            title:
              condition.title,

            message:
              condition.message,

            priority:
              condition.priority,

            isRead: false,

          });


        createdReminders.push(
          reminder
        );
      }
    }


    res.json({

      success: true,

      count:
        createdReminders.length,

      reminders:
        createdReminders,

    });

  } catch (error) {

    console.error(
      "Reminder generation error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to generate reminders",

    });
  }
};


// ==========================================
// GET USER REMINDERS
// ==========================================

export const getReminders = async (
  req,
  res
) => {
  try {

    const clerkId =
      req.userId;


    const reminders =
      await Reminder.find({
        userId: clerkId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(20);


    res.json({

      success: true,

      count:
        reminders.length,

      reminders,

    });

  } catch (error) {

    console.error(
      "Get reminders error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch reminders",

    });
  }
};


// ==========================================
// MARK REMINDER AS READ
// ==========================================

export const markReminderRead =
  async (req, res) => {
    try {

      const clerkId =
        req.userId;

      const {
        reminderId,
      } = req.params;


      const reminder =
        await Reminder.findOneAndUpdate(

          {
            _id:
              reminderId,

            userId:
              clerkId,
          },

          {
            isRead:
              true,
          },

          {
            new:
              true,
          }
        );


      if (!reminder) {

        return res.status(404).json({

          success: false,

          message:
            "Reminder not found",

        });
      }


      res.json({

        success: true,

        reminder,

      });

    } catch (error) {

      console.error(
        "Mark reminder error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to update reminder",

      });
    }
  };