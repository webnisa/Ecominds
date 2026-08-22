import PumpCommand from "../models/PumpCommand.js";
import PumpLog from "../models/PumpLog.js";
import Device from "../models/Device.js";
import Plant from "../models/Plant.js";


// ==========================================
// REQUEST PUMP
// USER → BACKEND → ESP32
// ==========================================

export const requestPump = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      duration = 10,
      source = "manual",
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: "plantId is required",
      });
    }


    const pumpDuration =
      Number(duration);


    if (
      Number.isNaN(pumpDuration) ||
      pumpDuration < 1 ||
      pumpDuration > 120
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duration must be between 1 and 120 seconds",
      });
    }


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
        message: "Plant not found",
      });
    }


    // ==========================================
    // FIND DEVICE
    // ==========================================

    const device =
      await Device.findOne({
        userId: clerkId,
        plantId,
        isActive: true,
      });


    if (!device) {
      return res.status(404).json({
        success: false,
        message:
          "No active device connected to this plant",
      });
    }


    // ==========================================
    // CHECK EXISTING COMMAND
    // ==========================================

    const existingCommand =
      await PumpCommand.findOne({
        deviceId: device._id,
        plantId,
        status: {
          $in: [
            "pending",
            "sent",
          ],
        },
      });


    if (existingCommand) {
      return res.status(409).json({
        success: false,
        message:
          "A pump command is already pending",
      });
    }


    // ==========================================
    // CREATE PUMP LOG
    // ==========================================

    const pumpLog =
      await PumpLog.create({

        userId: clerkId,

        plantId,

        deviceId:
          device._id,

        duration:
          pumpDuration,

        source,

        status:
          "pending",

      });


    // ==========================================
    // CREATE PUMP COMMAND
    // ==========================================

    const command =
      await PumpCommand.create({

        userId: clerkId,

        plantId,

        deviceId:
          device._id,

        command:
          "WATER",

        duration:
          pumpDuration,

        source,

        status:
          "pending",

        pumpLogId:
          pumpLog._id,

      });


    // ==========================================
    // CONNECT LOG + COMMAND
    // ==========================================

    pumpLog.status =
      "pending";

    await pumpLog.save();


    res.status(201).json({

      success: true,

      message:
        "Pump command created 💧",

      command,

      pumpLog,

    });

  } catch (error) {

    console.error(
      "Request pump error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to create pump command",

    });
  }
};


// ==========================================
// GET PUMP HISTORY
// ==========================================

export const getPumpHistory =
  async (req, res) => {

    try {

      const clerkId =
        req.userId;

      const {
        plantId,
      } = req.params;


      const history =
        await PumpLog.find({

          userId:
            clerkId,

          plantId,

        })
          .sort({
            createdAt: -1,
          })
          .limit(50);


      res.json({

        success: true,

        count:
          history.length,

        history,

      });

    } catch (error) {

      console.error(
        "Pump history error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch pump history",

      });
    }
  };