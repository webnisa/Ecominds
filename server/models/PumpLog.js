import mongoose from "mongoose";

const pumpLogSchema = new mongoose.Schema(
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
      index: true,
    },

    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      default: null,
    },

    duration: {
      type: Number,
      default: 10,
    },

    source: {
      type: String,
      enum: [
        "manual",
        "automatic",
        "ai",
      ],
      default: "manual",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "running",
        "completed",
        "failed",
      ],
      default: "pending",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PumpLog = mongoose.model(
  "PumpLog",
  pumpLogSchema
);

export default PumpLog;