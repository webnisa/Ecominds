import HealthHistory from "../models/HealthHistory.js";
import Plant from "../models/Plant.js";


// ==========================================
// GET PLANT HEALTH HISTORY
// ==========================================

export const getPlantHealthHistory = async (req, res) => {
  try {

    const clerkId = req.userId;

    const { plantId } = req.params;

    const limit = Number(req.query.limit) || 30;


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
    // GET HEALTH HISTORY
    // ==========================================

    const history = await HealthHistory.find({
      userId: clerkId,
      plantId,
    })
      .sort({
        analyzedAt: -1,
      })
      .limit(limit);


    // ==========================================
    // LATEST HEALTH
    // ==========================================

    const latestHealth =
      history.length > 0
        ? history[0]
        : null;


    res.json({

      success: true,

      plant: {
        id: plant._id,
        plantName: plant.plantName,
        plantType: plant.plantType,
      },

      count: history.length,

      latestHealth,

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
        "Failed to fetch plant health history",

    });

  }
};