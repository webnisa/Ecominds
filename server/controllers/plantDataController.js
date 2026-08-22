import PlantData from "../models/PlantData.js";
import Plant from "../models/Plant.js";


// ==========================================
// GET PLANT SENSOR HISTORY
// ==========================================

export const getPlantDataHistory = async (req, res) => {
  try {

    const clerkId = req.userId;

    const { plantId } = req.params;

    const limit = Number(req.query.limit) || 100;


    // ==========================================
    // CHECK PLANT
    // ==========================================

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


    // ==========================================
    // GET SENSOR DATA
    // ==========================================

    const data = await PlantData.find({

      userId: clerkId,

      plantId,

    })
      .sort({
        recordedAt: -1,
      })
      .limit(limit);


    // ==========================================
    // LATEST DATA
    // ==========================================

    const latestData =
      data.length > 0
        ? data[0]
        : null;


    // ==========================================
    // GRAPH DATA
    // ==========================================

    const graphData = data
      .slice()
      .reverse()
      .map((item) => ({

        time:
          item.recordedAt,

        soilMoisture:
          item.soilMoisture,

        temperature:
          item.temperature,

        humidity:
          item.humidity,

      }));


    res.json({

      success: true,

      plant: {

        id:
          plant._id,

        plantName:
          plant.plantName,

        plantType:
          plant.plantType,

      },

      count:
        data.length,

      latestData,

      graphData,

    });

  } catch (error) {

    console.error(
      "Plant data history error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch plant sensor history",

    });

  }
};

// ==========================================
// ADD SENSOR DATA
// ESP32 → Backend
// ==========================================

export const addPlantData = async (req, res) => {
  try {

    const {
      plantId,
      soilMoisture,
      temperature,
      humidity,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !plantId ||
      soilMoisture === undefined ||
      temperature === undefined ||
      humidity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "plantId, soilMoisture, temperature and humidity are required",
      });
    }


    // ==========================================
    // CHECK PLANT
    // ==========================================

    const plant = await Plant.findOne({
      _id: plantId,
      userId: req.userId,
    });


    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }


    // ==========================================
    // SAVE SENSOR DATA
    // ==========================================

    const sensorData =
      await PlantData.create({

        userId: req.userId,

        plantId: plant._id,

        soilMoisture:
          Number(soilMoisture),

        temperature:
          Number(temperature),

        humidity:
          Number(humidity),

        recordedAt:
          new Date(),

      });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({

      success: true,

      message:
        "Plant sensor data saved successfully 🌱📡",

      data: sensorData,

    });

  } catch (error) {

    console.error(
      "Add plant data error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to save plant sensor data",

    });

  }
};