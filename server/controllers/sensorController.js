import PlantData from "../models/PlantData.js";
import Plant from "../models/Plant.js";


// ==========================================
// RECEIVE SENSOR DATA
// ==========================================

export const receiveSensorData = async (
  req,
  res
) => {
  try {

    const {
      plantId,
      soilMoisture,
      temperature,
      humidity,
      light,
      recordedAt,
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

    const plant =
      await Plant.findById(
        plantId
      );


    if (!plant) {

      return res.status(404).json({

        success: false,

        message:
          "Plant not found",

      });

    }


    // ==========================================
    // SAVE SENSOR DATA
    // ==========================================

    const sensorData =
      await PlantData.create({

        userId:
          plant.userId,

        plantId:
          plant._id,

        soilMoisture:
          Number(soilMoisture),

        temperature:
          Number(temperature),

        humidity:
          Number(humidity),

        light:
          light !== undefined
            ? Number(light)
            : null,

        recordedAt:
          recordedAt
            ? new Date(recordedAt)
            : new Date(),

      });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({

      success: true,

      message:
        "Sensor data saved successfully 🌱",

      data: sensorData,

    });

  } catch (error) {

    console.error(
      "Sensor data error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to save sensor data",

    });

  }
};



// ==========================================
// GET LATEST SENSOR DATA
// ==========================================

export const getLatestSensorData = async (
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
    // CHECK PLANT OWNERSHIP
    // ==========================================

    const plant =
      await Plant.findOne({

        _id: plantId,

        userId: clerkId,

      });


    if (!plant) {

      return res.status(404).json({

        success: false,

        message:
          "Plant not found",

      });

    }


    // ==========================================
    // LATEST DATA
    // ==========================================

    const data =
      await PlantData.findOne({

        plantId,

        userId: clerkId,

      }).sort({

        recordedAt: -1,

      });


    if (!data) {

      return res.status(404).json({

        success: false,

        message:
          "No sensor data available",

      });

    }


    res.json({

      success: true,

      data,

    });

  } catch (error) {

    console.error(
      "Latest sensor error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch sensor data",

    });

  }
};



// ==========================================
// GET SENSOR HISTORY
// ==========================================

export const getSensorHistory = async (
  req,
  res
) => {

  try {

    const clerkId =
      req.userId;

    const {
      plantId,
    } = req.params;

    const days =
      Number(req.query.days) || 7;


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

        message:
          "Plant not found",

      });

    }


    // ==========================================
    // DATE FILTER
    // ==========================================

    const startDate =
      new Date();

    startDate.setDate(
      startDate.getDate() - days
    );


    // ==========================================
    // GET HISTORY
    // ==========================================

    const history =
      await PlantData.find({

        plantId,

        userId: clerkId,

        recordedAt: {
          $gte: startDate,
        },

      }).sort({

        recordedAt: 1,

      });


    // ==========================================
    // GRAPH DATA
    // ==========================================

    const graphData =
      history.map((item) => ({

        date:
          item.recordedAt,

        soilMoisture:
          item.soilMoisture,

        temperature:
          item.temperature,

        humidity:
          item.humidity,

        light:
          item.light,

      }));


    res.json({

      success: true,

      days,

      count:
        history.length,

      graphData,

      history,

    });

  } catch (error) {

    console.error(
      "Sensor history error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch sensor history",

    });

  }
};