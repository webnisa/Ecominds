import PumpPreference from "../models/PumpPreference.js";


// ==========================================
// GET PUMP PREFERENCE
// ==========================================

export const getPumpPreference = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    let preference =
      await PumpPreference.findOne({
        userId: clerkId,
      });

    if (!preference) {
      preference =
        await PumpPreference.create({
          userId: clerkId,
        });
    }

    res.json({
      success: true,
      preference,
    });

  } catch (error) {
    console.error(
      "Get pump preference error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to get pump preference",
    });
  }
};


// ==========================================
// UPDATE PUMP PREFERENCE
// ==========================================

export const updatePumpPreference =
  async (req, res) => {
    try {
      const clerkId = req.userId;

      const {
        mode,
        autoWateringEnabled,
        defaultDuration,
      } = req.body;


      if (
        mode &&
        ![
          "manual",
          "automatic",
          "ask_every_time",
        ].includes(mode)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid pump mode",
        });
      }


      const update = {};

      if (mode !== undefined) {
        update.mode = mode;
      }

      if (
        autoWateringEnabled !== undefined
      ) {
        update.autoWateringEnabled =
          autoWateringEnabled;
      }

      if (defaultDuration !== undefined) {

        const duration =
          Number(defaultDuration);

        if (
          Number.isNaN(duration) ||
          duration < 1 ||
          duration > 120
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Duration must be between 1 and 120 seconds",
          });
        }

        update.defaultDuration =
          duration;
      }


      const preference =
        await PumpPreference.findOneAndUpdate(

          {
            userId: clerkId,
          },

          {
            $set: update,
          },

          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );


      res.json({
        success: true,
        message:
          "Pump preference updated 💧",
        preference,
      });

    } catch (error) {
      console.error(
        "Update pump preference error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update pump preference",
      });
    }
  };