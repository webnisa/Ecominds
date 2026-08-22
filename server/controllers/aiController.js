import Plant from "../models/Plant.js";
import PlantHealth from "../models/PlantHealth.js";
import Reminder from "../models/Reminder.js";

import {
  analyzePlantHealth,
} from "../services/plantHealthService.js";


// ==========================================
// ANALYZE PLANT
// ==========================================

export const analyzePlant = async (
  req,
  res
) => {
  try {

    const clerkId =
      req.userId;

    const {
      plantId,
    } = req.params;


    // ==========================================
    // CHECK PLANT
    // ==========================================

    const plant =
      await Plant.findOne({
        _id: plantId,
        userId: clerkId,
      });


    if (!plant) {

      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });

    }


    // ==========================================
    // ANALYZE HISTORY
    // ==========================================

    const result =
      await analyzePlantHealth({
        plantId,
        userId: clerkId,
      });


    // ==========================================
    // SAVE RESULT
    // ==========================================

    const health =
      await PlantHealth.create({

        userId: clerkId,

        plantId,

        healthScore:
          result.healthScore,

        status:
          result.status,

        riskLevel:
          result.riskLevel,

        analysis:
          result.analysis,

        recommendation:
          result.recommendation,

        factors:
          result.factors,

        dataPointsUsed:
          result.dataPointsUsed,

        generatedAt:
          new Date(),

      });


    res.json({

      success: true,

      message:
        "Plant health analysis completed 🤖🌱",

      health,

    });

  } catch (error) {

    console.error(
      "AI plant analysis error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to analyze plant health",

    });

  }
  // ==========================================
// CREATE REMINDER FROM AI RESULT
// ==========================================

if (
  result.riskLevel === "high" ||
  result.status === "critical"
) {

  const existingReminder =
    await Reminder.findOne({
      userId: clerkId,
      plantId,
      type: "ai_health_warning",
      isRead: false,
    });


  if (!existingReminder) {

    await Reminder.create({

      userId: clerkId,

      plantId,

      type:
        "ai_health_warning",

      title:
        "Plant health warning 🤖🌱",

      message:
        result.recommendation,

      priority:
        "high",

      isRead:
        false,

    });
  }
}
};


// ==========================================
// GET LATEST HEALTH
// ==========================================

export const getLatestPlantHealth =
  async (req, res) => {
    try {

      const clerkId =
        req.userId;

      const {
        plantId,
      } = req.params;


      const health =
        await PlantHealth.findOne({
          userId: clerkId,
          plantId,
        })
          .sort({
            generatedAt: -1,
          });


      if (!health) {

        return res.status(404).json({

          success: false,

          message:
            "No health analysis found",

        });

      }


      res.json({

        success: true,

        health,

      });

    } catch (error) {

      console.error(
        "Get plant health error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch plant health",

      });

    }
  };


// ==========================================
// GET HEALTH HISTORY
// ==========================================

export const getPlantHealthHistory =
  async (req, res) => {
    try {

      const clerkId =
        req.userId;

      const {
        plantId,
      } = req.params;


      const history =
        await PlantHealth.find({

          userId:
            clerkId,

          plantId,

        })
          .sort({
            generatedAt: -1,
          })
          .limit(30);


      res.json({

        success: true,

        count:
          history.length,

        history,

      });

    } catch (error) {

      console.error(
        "Health history error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch health history",

      });

    }
  };