import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";
import HealthHistory from "../models/HealthHistory.js";
import Reminder from "../models/Reminder.js";
import Points from "../models/Points.js";
import Device from "../models/Device.js";


// ==========================================
// GET DASHBOARD SUMMARY
// ==========================================

export const getDashboardSummary = async (req, res) => {
  try {

    const clerkId = req.userId;


    // ==========================================
    // GET ALL USER PLANTS
    // ==========================================

    const plants = await Plant.find({
      userId: clerkId,
    }).sort({
      createdAt: -1,
    });


    // ==========================================
    // USER POINTS
    // ==========================================

    let points = await Points.findOne({
      userId: clerkId,
    });

    if (!points) {
      points = await Points.create({
        userId: clerkId,
      });
    }


    // ==========================================
    // UNREAD REMINDERS
    // ==========================================

    const reminders = await Reminder.find({
      userId: clerkId,
      isRead: false,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);


    // ==========================================
    // PLANT DASHBOARD DATA
    // ==========================================

    const plantDashboard = [];


    for (const plant of plants) {

      // Latest sensor data
      const latestData =
        await PlantData.findOne({
          userId: clerkId,
          plantId: plant._id,
        }).sort({
          recordedAt: -1,
        });


      // Latest health analysis
      const latestHealth =
        await HealthHistory.findOne({
          userId: clerkId,
          plantId: plant._id,
        }).sort({
          analyzedAt: -1,
        });


      // Connected ESP32
      const device =
        await Device.findOne({
          userId: clerkId,
          plantId: plant._id,
          isActive: true,
        });


      plantDashboard.push({

        plant: {
          id: plant._id,
          plantName: plant.plantName,
          plantType: plant.plantType,
        },

        sensorData: latestData
          ? {
              soilMoisture:
                latestData.soilMoisture,

              temperature:
                latestData.temperature,

              humidity:
                latestData.humidity,

              recordedAt:
                latestData.recordedAt,
            }
          : null,

        health: latestHealth
          ? {
              healthScore:
                latestHealth.healthScore,

              healthStatus:
                latestHealth.healthStatus,

              riskLevel:
                latestHealth.riskLevel,

              prediction:
                latestHealth.prediction,

              recommendation:
                latestHealth.recommendation,

              analyzedAt:
                latestHealth.analyzedAt,
            }
          : null,

        device: device
          ? {
              deviceId:
                device.deviceId,

              deviceName:
                device.deviceName,

              isActive:
                device.isActive,

              lastSeen:
                device.lastSeen,
            }
          : null,

      });
    }


    // ==========================================
    // DASHBOARD RESPONSE
    // ==========================================

    res.json({

      success: true,

      summary: {

        totalPlants:
          plants.length,

        totalPoints:
          points.totalPoints,

        currentStreak:
          points.currentStreak,

        longestStreak:
          points.longestStreak,

        unreadReminders:
          reminders.length,

      },

      points,

      plants:
        plantDashboard,

      reminders,

    });

  } catch (error) {

    console.error(
      "Dashboard summary error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard",

    });

  }
};