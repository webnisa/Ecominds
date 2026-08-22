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
      image,
      notes,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!plantName) {
      return res.status(400).json({
        success: false,
        message: "Plant name is required",
      });
    }


    // ==========================================
    // CREATE PLANT
    // ==========================================

    const plant = await Plant.create({
      userId: clerkId,

      plantName,

      plantType:
        plantType || "",

      location:
        location || "",

      image:
        image || "",

      notes:
        notes || "",
    });


    res.status(201).json({
      success: true,

      message:
        "Plant added successfully 🌱",

      plant,
    });

  } catch (error) {

    console.error(
      "Add plant error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to add plant",
    });
  }
};



// ==========================================
// GET ALL USER PLANTS
// ==========================================

export const getPlants = async (req, res) => {
  try {

    const clerkId = req.userId;


    const plants = await Plant.find({
      userId: clerkId,
    }).sort({
      createdAt: -1,
    });


    res.json({
      success: true,

      count: plants.length,

      plants,
    });

  } catch (error) {

    console.error(
      "Get plants error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch plants",
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

        message:
          "Plant not found",
      });
    }


    res.json({
      success: true,

      plant,
    });

  } catch (error) {

    console.error(
      "Get plant error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch plant",
    });
  }
};



// ==========================================
// UPDATE PLANT
// ==========================================

export const updatePlant = async (
  req,
  res
) => {
  try {

    const clerkId = req.userId;

    const { plantId } = req.params;


    const {
      plantName,
      plantType,
      location,
      image,
      notes,
    } = req.body;


    const plant =
      await Plant.findOneAndUpdate(

        {
          _id: plantId,

          userId: clerkId,
        },

        {
          ...(plantName !== undefined && {
            plantName,
          }),

          ...(plantType !== undefined && {
            plantType,
          }),

          ...(location !== undefined && {
            location,
          }),

          ...(image !== undefined && {
            image,
          }),

          ...(notes !== undefined && {
            notes,
          }),
        },

        {
          new: true,

          runValidators: true,
        }
      );


    if (!plant) {

      return res.status(404).json({
        success: false,

        message:
          "Plant not found",
      });
    }


    res.json({
      success: true,

      message:
        "Plant updated successfully 🌱",

      plant,
    });

  } catch (error) {

    console.error(
      "Update plant error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to update plant",
    });
  }
};



// ==========================================
// DELETE PLANT
// ==========================================

export const deletePlant = async (
  req,
  res
) => {
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

        message:
          "Plant not found",

      });

    }


    res.json({

      success: true,

      message:
        "Plant deleted successfully 🌱",

    });

  } catch (error) {

    console.error(
      "Delete plant error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to delete plant",

    });

  }
};