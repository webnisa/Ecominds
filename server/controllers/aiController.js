import {
  analyzePlantImage as analyzeImageService,
} from "../services/plantHealthService.js";

import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";

import {
  predictPlantHealth,
} from "../services/aiService.js";

// ============================================================
// IMAGE AI
// POST /api/ai/analyze-image
// ============================================================

export async function analyzePlantImage(
  req,
  res
) {
  try {
    console.log(
      "🌱 AI IMAGE REQUEST RECEIVED"
    );

    // --------------------------------------------------------
    // CHECK IMAGE
    // --------------------------------------------------------

    if (!req.file) {
      console.log(
        "❌ No image received"
      );

      return res.status(400).json({
        success: false,
        message:
          "Please upload a plant image.",
      });
    }

    console.log(
      "📦 Multer file object received"
    );

    console.log("📸 File:", {
      fieldname:
        req.file.fieldname,

      originalname:
        req.file.originalname,

      mimetype:
        req.file.mimetype,

      path:
        req.file.path,

      size:
        req.file.size,
    });

    // --------------------------------------------------------
    // IMPORTANT
    //
    // Send complete multer file object.
    //
    // This keeps your existing image AI working.
    // --------------------------------------------------------

    const result =
      await analyzeImageService(
        req.file
      );

    console.log(
      "🤖 IMAGE AI RESULT:",
      result
    );

    return res.status(200).json({
      success: true,

      suggestion:
        result,
    });

  } catch (error) {
    console.error(
      "❌ REAL IMAGE AI ERROR:",
      error
    );

    // --------------------------------------------------------
    // OPENAI CREDIT ERROR
    // --------------------------------------------------------

    if (
      error?.status === 429 ||
      error?.code ===
        "insufficient_quota" ||
      error?.code ===
        "credit_balance_exhausted"
    ) {
      return res.status(429).json({
        success: false,

        message:
          "OpenAI API credits are exhausted. Please add credits to continue AI analysis.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "AI image analysis failed.",
    });
  }
}

// ============================================================
// SENSOR AI PREDICTION
// POST /api/ai/predict-health/:plantId
// ============================================================

export async function predictHealth(
  req,
  res
) {
  try {
    const clerkId =
      req.auth?.userId ||
      req.userId;

    const {
      plantId,
    } = req.params;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized.",
      });
    }

    // --------------------------------------------------------
    // FIND PLANT
    // --------------------------------------------------------

    const plant =
      await Plant.findOne({
        _id: plantId,
        userId: clerkId,
      });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message:
          "Plant not found.",
      });
    }

    // --------------------------------------------------------
    // LAST 5 DAYS
    // --------------------------------------------------------

    const fiveDaysAgo =
      new Date();

    fiveDaysAgo.setDate(
      fiveDaysAgo.getDate() - 5
    );

    const sensorData =
      await PlantData.find({
        plantId: plant._id,

        userId: clerkId,

        recordedAt: {
          $gte: fiveDaysAgo,
        },
      })
        .sort({
          recordedAt: -1,
        })
        .limit(100);

    if (
      !sensorData ||
      sensorData.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No sensor history available for this plant.",
      });
    }

    // --------------------------------------------------------
    // AI
    // --------------------------------------------------------

    const result =
      await predictPlantHealth({
        plant,

        sensorData,

        careHistory: [],
      });

    return res.status(200).json({
      success: true,

      plantId,

      dataPointsUsed:
        sensorData.length,

      prediction:
        result,
    });

  } catch (error) {
    console.error(
      "❌ Sensor AI prediction error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Failed to predict plant health.",
    });
  }
}