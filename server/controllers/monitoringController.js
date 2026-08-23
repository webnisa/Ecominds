import PlantData from "../models/PlantData.js";
import Plant from "../models/Plant.js";

// ============================================================
// GET PLANT MONITORING HISTORY
// ============================================================

export const getPlantMonitoring = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { plantId } = req.params;

    // --------------------------------------------------------
    // Check plant belongs to logged-in user
    // --------------------------------------------------------

    const plant = await Plant.findOne({
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
    // Get sensor history
    // --------------------------------------------------------

    const history = await PlantData.find({
      plantId,
      userId: clerkId,
    })
      .sort({
        recordedAt: 1,
      })
      .limit(100);

    return res.json({
      success: true,

      plant: {
        id: plant._id,
        plantName: plant.plantName,
        plantType: plant.plantType,
        location: plant.location,
        healthScore: plant.healthScore,
        health: plant.health,
        lastHealthCheck: plant.lastHealthCheck,
      },

      history,
    });
  } catch (error) {
    console.error(
      "Monitoring fetch error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch monitoring data",
      error: error.message,
    });
  }
};


// ============================================================
// ADD SENSOR DATA
//
// ESP / IoT can use this API
// ============================================================

export const addSensorData = async (req, res) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      soilMoisture,
      temperature,
      humidity,
      light,
    } = req.body;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: "plantId is required",
      });
    }

    // --------------------------------------------------------
    // Check plant
    // --------------------------------------------------------

    const plant = await Plant.findOne({
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
    // Save sensor reading
    // --------------------------------------------------------

    const sensorData = await PlantData.create({
      userId: clerkId,
      plantId,

      soilMoisture:
        soilMoisture !== undefined
          ? Number(soilMoisture)
          : null,

      temperature:
        temperature !== undefined
          ? Number(temperature)
          : null,

      humidity:
        humidity !== undefined
          ? Number(humidity)
          : null,

      light:
        light !== undefined
          ? Number(light)
          : null,

      recordedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Sensor data saved 🌱",
      data: sensorData,
    });
  } catch (error) {
    console.error(
      "Sensor data error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save sensor data",
      error: error.message,
    });
  }
};