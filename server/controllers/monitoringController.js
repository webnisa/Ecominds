import PlantData from "../models/PlantData.js";
import Plant from "../models/Plant.js";
import { getAuth } from "@clerk/express";
// ============================================================
// GET ALL PLANTS MONITORING
// GET /api/monitoring
// ============================================================

export const getAllPlantsMonitoring = async (req, res) => {
  try {
    const clerkId = req.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // --------------------------------------------------------
    // GET ALL USER PLANTS
    // --------------------------------------------------------

    const plants = await Plant.find({
      userId: clerkId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    // --------------------------------------------------------
    // GET SENSOR DATA FOR EACH PLANT
    // --------------------------------------------------------

    const monitoringData = await Promise.all(
      plants.map(async (plant) => {
        // Latest 30 readings
        const history = await PlantData.find({
          plantId: plant._id,
          userId: clerkId,
        })
          .sort({
            recordedAt: -1,
          })
          .limit(30)
          .lean();

        // Latest reading
        const latestSensor =
          history.length > 0
            ? history[0]
            : null;

        // Graph ke liye oldest → newest
        const chartHistory =
          [...history].reverse();

        return {
          plant: {
  id: plant._id,

  plantName:
    plant.plantName,

  plantType:
    plant.plantType,

  location:
    plant.location,

  image:
    plant.image || "",

  healthScore:
    plant.healthScore || 0,

  health:
    plant.health || "Uncertain",

  lastHealthCheck:
    plant.lastHealthCheck || null,

  lastWatered:
    plant.lastWatered || null,

  nutrients:
    plant.nutrients || 0,

  aiInsight:
    plant.aiInsight ||
    "Keep monitoring your plant regularly.",
},
        }
      })
    );

    // ========================================================
    // OVERALL SUMMARY
    // ========================================================

    const totalPlants =
      monitoringData.length;

    let healthyPlants = 0;
    let warningPlants = 0;
    let criticalPlants = 0;
    let plantsNeedWater = 0;

    monitoringData.forEach(
      (item) => {
        const score =
          Number(
            item.plant.healthScore
          );

        // Health
        if (!Number.isNaN(score)) {
          if (score >= 75) {
            healthyPlants++;
          } else if (score >= 40) {
            warningPlants++;
          } else {
            criticalPlants++;
          }
        }

        // Moisture
        const moisture =
          item.latestSensor
            ?.soilMoisture;

        if (
          moisture !== null &&
          moisture !== undefined &&
          Number(moisture) < 30
        ) {
          plantsNeedWater++;
        }
      }
    );

    return res.status(200).json({
      success: true,

      summary: {
        totalPlants,
        healthyPlants,
        warningPlants,
        criticalPlants,
        plantsNeedWater,
      },

      plants: monitoringData,
    });
  } catch (error) {
    console.error(
      "❌ All plants monitoring error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch monitoring data",
      error: error.message,
    });
  }
};


// ============================================================
// GET SINGLE PLANT MONITORING
// GET /api/monitoring/:plantId
// ============================================================

export const getPlantMonitoring = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;
    const { plantId } = req.params;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // --------------------------------------------------------
    // CHECK PLANT
    // --------------------------------------------------------

    const plant =
      await Plant.findOne({
        _id: plantId,
        userId: clerkId,
      }).lean();

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    // --------------------------------------------------------
    // SENSOR HISTORY
    // --------------------------------------------------------

    const history =
      await PlantData.find({
        plantId,
        userId: clerkId,
      })
        .sort({
          recordedAt: 1,
        })
        .limit(100)
        .lean();

    const latestSensor =
      history.length > 0
        ? history[history.length - 1]
        : null;

    return res.status(200).json({
      success: true,

      plant: {
        id: plant._id,
        plantName: plant.plantName,
        plantType: plant.plantType,
        location: plant.location,
        healthScore:
          plant.healthScore,
        health: plant.health,
        lastHealthCheck:
          plant.lastHealthCheck,
      },

      latestSensor,

      history,
    });
  } catch (error) {
    console.error(
      "❌ Monitoring fetch error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch monitoring data",
      error: error.message,
    });
  }
};


// ============================================================
// ADD SENSOR DATA
// POST /api/monitoring/sensor
// ============================================================

export const addSensorData = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      soilMoisture,
      temperature,
      humidity,
      light,
    } = req.body;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message:
          "plantId is required",
      });
    }

    // --------------------------------------------------------
    // CHECK PLANT
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // CONVERT VALUES SAFELY
    // --------------------------------------------------------

    const convertNumber = (
      value
    ) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return null;
      }

      const number =
        Number(value);

      return Number.isFinite(number)
        ? number
        : null;
    };

    // --------------------------------------------------------
    // SAVE SENSOR DATA
    // --------------------------------------------------------

    const sensorData =
      await PlantData.create({
        userId: clerkId,

        plantId,

        soilMoisture:
          convertNumber(
            soilMoisture
          ),

        temperature:
          convertNumber(
            temperature
          ),

        humidity:
          convertNumber(
            humidity
          ),

        light:
          convertNumber(light),

        recordedAt:
          new Date(),
      });

    return res.status(201).json({
      success: true,

      message:
        "Sensor data saved 🌱",

      data: sensorData,
    });
  } catch (error) {
    console.error(
      "❌ Sensor data error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to save sensor data",
      error: error.message,
    });
  }
};

