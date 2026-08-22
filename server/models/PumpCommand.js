import mongoose from "mongoose";

const pumpCommandSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },

    command: {
      type: String,
      enum: ["WATER", "STOP"],
      required: true,
    },

    duration: {
      type: Number,
      default: 10,
      min: 1,
      max: 120,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "sent",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
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

    pumpLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PumpLog",
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PumpCommand = mongoose.model(
  "PumpCommand",
  pumpCommandSchema
);

export default PumpCommand;