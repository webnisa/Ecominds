import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    deviceKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    deviceName: {
      type: String,
      default: "EcoMinds ESP32",
    },

    deviceType: {
      type: String,
      default: "ESP32",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    pumpEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model(
  "Device",
  deviceSchema
);

export default Device;