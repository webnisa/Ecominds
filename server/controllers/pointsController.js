import Points from "../models/Points.js";


// ==========================================
// GET MY POINTS
// ==========================================

export const getMyPoints = async (
  req,
  res
) => {

  try {

    const clerkId =
      req.userId;


    let points =
      await Points.findOne({
        userId: clerkId,
      });


    if (!points) {

      points =
        await Points.create({
          userId: clerkId,
        });

    }


    res.json({

      success: true,

      points,

    });

  } catch (error) {

    console.error(
      "Get points error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch points",

    });

  }
};