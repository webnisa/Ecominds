import CareHistory from "../models/CareHistory.js";
import Plant from "../models/Plant.js";

import {
  updateCarePoints,
} from "../services/pointsService.js";


// ==========================================
// ADD PLANT CARE
// ==========================================

export const addCare = async (req, res) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      careType,
      notes,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!plantId || !careType) {
      return res.status(400).json({
        success: false,
        message:
          "plantId and careType are required",
      });
    }


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
    // SAVE CARE HISTORY
    // ==========================================

    const care = await CareHistory.create({
      userId: clerkId,

      plantId: plant._id,

      careType,

      notes: notes || "",

      performedAt: new Date(),
    });


    // ==========================================
    // UPDATE POINTS
    // ==========================================

    const points = await updateCarePoints(
      clerkId
    );


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({

      success: true,

      message:
        "Plant care recorded successfully 🌱",

      care,

      points,

    });

  } catch (error) {

    console.error(
      "Add care error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to record plant care",

    });
  }
};


// ==========================================
// GET CARE HISTORY
// ==========================================

export const getCareHistory = async (
  req,
  res
) => {
  try {

    const clerkId = req.userId;

    const { plantId } = req.params;


    const careHistory =
      await CareHistory.find({

        userId: clerkId,

        plantId,

      })
        .sort({
          performedAt: -1,
        })
        .limit(50);


    res.json({

      success: true,

      count:
        careHistory.length,

      careHistory,

    });

  } catch (error) {

    console.error(
      "Get care history error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch care history",

    });
  }
};