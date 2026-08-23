import mongoose from "mongoose";

const plantDataSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    userId: {
      type: String,
      required: true,
      index: true,
    },

    // ==========================================
    // PLANT
    // ==========================================

    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
      index: true,
    },

    // ==========================================
    // SOIL MOISTURE
    // ==========================================

    soilMoisture: {
      type: Number,
      default: null,
    },

    // ==========================================
    // TEMPERATURE
    // ==========================================

    temperature: {
      type: Number,
      default: null,
    },

    // ==========================================
    // HUMIDITY
    // ==========================================

    humidity: {
      type: Number,
      default: null,
    },

    // ==========================================
    // LIGHT / SUNLIGHT
    // ==========================================

    light: {
      type: Number,
      default: null,
    },

    // Optional alias if your frontend/backend
    // ever sends sunlight instead of light
    sunlight: {
      type: Number,
      default: null,
    },

    // ==========================================
    // RECORD TIME
    // ==========================================

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PREVENT MONGOOSE OVERWRITE ERROR
// ==========================================

const PlantData =
  mongoose.models.PlantData ||
  mongoose.model("PlantData", plantDataSchema);

export default PlantData;