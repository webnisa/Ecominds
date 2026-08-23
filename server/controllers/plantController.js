import Plant from "../models/Plant.js";

// ==========================================
// ADD PLANT
// ==========================================

export const addPlant = async (req, res) => {
  try {
    const clerkId = req.userId;

    const {
      plantName,
      plantType,
      location,
      wateringFrequency,
    } = req.body;

    if (!plantName || !plantName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Plant name is required",
      });
    }

    // ==========================================
    // IMAGE
    // ==========================================

    let image = "";

    if (req.file) {
      image = `/uploads/plants/${req.file.filename}`;
    }

    // ==========================================
    // CREATE PLANT
    // ==========================================

    const plant = await Plant.create({
      userId: clerkId,

      plantName: plantName.trim(),

      plantType: plantType || "",

      location: location || "",

      image,

      wateringFrequency:
        Number(wateringFrequency) || 7,
    });

    return res.status(201).json({
      success: true,
      message: "Plant added successfully 🌱",
      plant,
    });
  } catch (error) {
    console.error("Add plant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add plant",
    });
  }
};

// ==========================================
// GET ALL PLANTS
// ==========================================

export const getPlants = async (req, res) => {
  try {
    const clerkId = req.userId;

    const plants = await Plant.find({
      userId: clerkId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: plants.length,
      plants,
    });
  } catch (error) {
    console.error("Get plants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plants",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PLANT
// ==========================================

export const getPlant = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { plantId } = req.params;

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

    return res.json({
      success: true,
      plant,
    });
  } catch (error) {
    console.error("Get plant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plant",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PLANT
// ==========================================

export const updatePlant = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { plantId } = req.params;

    const {
      plantName,
      plantType,
      location,
      wateringFrequency,
      notes,
    } = req.body;

    const updateData = {};

    if (plantName !== undefined) {
      updateData.plantName = plantName;
    }

    if (plantType !== undefined) {
      updateData.plantType = plantType;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    if (wateringFrequency !== undefined) {
      updateData.wateringFrequency =
        Number(wateringFrequency);
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // ==========================================
    // NEW IMAGE
    // ==========================================

    if (req.file) {
      updateData.image =
        `/uploads/plants/${req.file.filename}`;
    }

    const plant =
      await Plant.findOneAndUpdate(
        {
          _id: plantId,
          userId: clerkId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    return res.json({
      success: true,
      message: "Plant updated successfully 🌱",
      plant,
    });
  } catch (error) {
    console.error("Update plant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update plant",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PLANT
// ==========================================

export const deletePlant = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { plantId } = req.params;

    const plant =
      await Plant.findOneAndDelete({
        _id: plantId,
        userId: clerkId,
      });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    return res.json({
      success: true,
      message: "Plant deleted successfully 🌱",
    });
  } catch (error) {
    console.error("Delete plant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete plant",
      error: error.message,
    });
  }
};