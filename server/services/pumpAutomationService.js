import PumpPreference from "../models/PumpPreference.js";
import PumpCommand from "../models/PumpCommand.js";
import PlantData from "../models/PlantData.js";
import Plant from "../models/Plant.js";
import Device from "../models/Device.js";


export const processAutomaticWatering =
  async ({
    plantId,
    userId,
  }) => {

    try {

      // ==========================================
      // GET USER PREFERENCE
      // ==========================================

      const preference =
        await PumpPreference.findOne({
          userId,
        });


      if (
        !preference ||
        preference.mode !== "automatic" ||
        !preference.autoWateringEnabled
      ) {

        return {
          triggered: false,
          reason:
            "Automatic watering is disabled",
        };

      }


      // ==========================================
      // GET LATEST SENSOR DATA
      // ==========================================

      const latestData =
        await PlantData.findOne({
          plantId,
          userId,
        }).sort({
          recordedAt: -1,
        });


      if (!latestData) {

        return {
          triggered: false,
          reason:
            "No sensor data available",
        };

      }


      const moisture =
        Number(
          latestData.soilMoisture
        );


      // ==========================================
      // WATER ONLY WHEN REALLY DRY
      // ==========================================

      if (
        Number.isNaN(moisture) ||
        moisture >= 20
      ) {

        return {
          triggered: false,
          reason:
            "Soil moisture is not low enough",
        };

      }


      // ==========================================
      // FIND DEVICE
      // ==========================================

      const device =
        await Device.findOne({
          userId,
          plantId,
          isActive: true,
        });


      if (!device) {

        return {
          triggered: false,
          reason:
            "No active device found",
        };

      }


      // ==========================================
      // CHECK EXISTING COMMAND
      // ==========================================

      const existingCommand =
        await PumpCommand.findOne({

          deviceId:
            device._id,

          plantId,

          status: {
            $in: [
              "pending",
              "sent",
            ],
          },

        });


      if (existingCommand) {

        return {
          triggered: false,

          reason:
            "Pump command already pending",
        };

      }


      // ==========================================
      // CREATE COMMAND
      // ==========================================

      const command =
        await PumpCommand.create({

          userId,

          plantId,

          deviceId:
            device._id,

          command:
            "WATER",

          duration:
            preference.defaultDuration,

          status:
            "pending",

        });


      return {

        triggered: true,

        message:
          "Automatic watering command created 💧",

        command,

      };

    } catch (error) {

      console.error(
        "Automatic watering error:",
        error
      );

      throw error;
    }
  };