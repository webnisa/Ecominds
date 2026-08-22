import crypto from "crypto";

import Device from "../models/Device.js";
import PumpCommand from "../models/PumpCommand.js";
import PumpLog from "../models/PumpLog.js";


// ==========================================
// REGISTER DEVICE
// USER → BACKEND
// ==========================================

export const registerDevice = async (req, res) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      deviceId,
      deviceName,
    } = req.body;


    // Validation
    if (!plantId || !deviceId) {
      return res.status(400).json({
        success: false,
        message:
          "plantId and deviceId are required",
      });
    }


    // Generate secure device key
    const deviceKey =
      crypto
        .randomBytes(32)
        .toString("hex");


    // Create / update device
    const device =
      await Device.findOneAndUpdate(
        {
          deviceId,
        },

        {
          userId: clerkId,

          plantId,

          deviceId,

          deviceName:
            deviceName ||
            "EcoMinds ESP32",

          deviceType: "ESP32",

          deviceKey,

          isActive: true,

          lastSeen: new Date(),
        },

        {
          new: true,

          upsert: true,

          runValidators: true,
        }
      );


    res.status(201).json({
      success: true,

      message:
        "Device registered successfully 📡",

      deviceId:
        device.deviceId,

      deviceKey:
        device.deviceKey,

      device: {
        _id: device._id,
        deviceId:
          device.deviceId,

        deviceName:
          device.deviceName,

        plantId:
          device.plantId,

        isActive:
          device.isActive,
      },
    });

  } catch (error) {

    console.error(
      "Device registration error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to register device",
    });
  }
};


// ==========================================
// DEVICE HEARTBEAT
// ESP32 → BACKEND
// ==========================================

export const deviceHeartbeat = async (
  req,
  res
) => {
  try {

    const device =
      req.device;


    device.lastSeen =
      new Date();

    device.isActive =
      true;

    await device.save();


    res.json({
      success: true,

      message:
        "Device is online 📡",

      lastSeen:
        device.lastSeen,
    });

  } catch (error) {

    console.error(
      "Heartbeat error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Heartbeat failed",
    });
  }
};


// ==========================================
// GET USER DEVICES
// USER → BACKEND
// ==========================================

export const getMyDevices = async (
  req,
  res
) => {
  try {

    const clerkId =
      req.userId;


    const devices =
      await Device.find({
        userId: clerkId,
      })
        .select(
          "-deviceKey"
        )
        .sort({
          createdAt: -1,
        });


    res.json({
      success: true,

      count:
        devices.length,

      devices,
    });

  } catch (error) {

    console.error(
      "Get devices error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch devices",
    });
  }
};


// ==========================================
// GET PENDING PUMP COMMAND
// ESP32 → BACKEND
// ==========================================

export const getPendingPumpCommand =
  async (req, res) => {
    try {

      const device =
        req.device;


      const command =
        await PumpCommand.findOneAndUpdate(

          {
            deviceId:
              device._id,

            status:
              "pending",
          },

          {
            status:
              "sent",
          },

          {
            new: true,

            sort: {
              createdAt: 1,
            },
          }
        );


      // No command
      if (!command) {

        return res.json({
          success: true,

          command: null,
        });

      }


      res.json({
        success: true,

        command: {
          id:
            command._id,

          command:
            command.command,

          duration:
            command.duration,

          plantId:
            command.plantId,
        },
      });

    } catch (error) {

      console.error(
        "Get pump command error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to get pump command",
      });
    }
  };


// ==========================================
// COMPLETE PUMP COMMAND
// ESP32 → BACKEND
// ==========================================

export const completePumpCommand =
  async (req, res) => {

    try {

      const device =
        req.device;

      const {
        commandId,
        success = true,
      } = req.body;


      if (!commandId) {
        return res.status(400).json({
          success: false,
          message:
            "commandId is required",
        });
      }


      const command =
        await PumpCommand.findOne({

          _id:
            commandId,

          deviceId:
            device._id,

        });


      if (!command) {
        return res.status(404).json({
          success: false,
          message:
            "Pump command not found",
        });
      }


      command.status =
        success
          ? "completed"
          : "failed";

      command.executedAt =
        new Date();

      await command.save();


      // ==========================================
      // UPDATE PUMP LOG
      // ==========================================

      if (command.pumpLogId) {

        await PumpLog.findByIdAndUpdate(

          command.pumpLogId,

          {
            status:
              success
                ? "completed"
                : "failed",

            startedAt:
              command.executedAt,

            completedAt:
              new Date(),
          }

        );

      }


      res.json({

        success: true,

        message:
          success
            ? "Pump watering completed 💧"
            : "Pump watering failed",

        command,

      });

    } catch (error) {

      console.error(
        "Complete pump command error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to complete pump command",

      });
    }
  };