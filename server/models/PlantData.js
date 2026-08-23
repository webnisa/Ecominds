import mongoose from "mongoose";

const plantDataSchema = new mongoose.Schema(
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

    soilMoisture: {
      type: Number,
      default: null,
    },

    temperature: {
      type: Number,
      default: null,
    },

    humidity: {
      type: Number,
      default: null,
    },

    // ☀️ Sunlight / LDR sensor value
    light: {
      type: Number,
      default: null,
    },

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

// IMPORTANT:
// Nodemon/Mongoose duplicate model error avoid karega
const PlantData =
  mongoose.models.PlantData ||
  mongoose.model("PlantData", plantDataSchema);

export default PlantData;