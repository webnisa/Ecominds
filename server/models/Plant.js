import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
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
    // BASIC PLANT INFO
    // ==========================================

    plantName: {
      type: String,
      required: true,
      trim: true,
    },

    plantType: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // ==========================================
    // WATERING
    // ==========================================

    wateringFrequency: {
      type: Number,
      default: 7,
    },

    lastWatered: {
      type: Date,
      default: null,
    },

    nextWateringDate: {
      type: Date,
      default: null,
    },

    // ==========================================
    // AI HEALTH
    // ==========================================

    healthScore: {
      type: Number,
      default: 0,
    },

    health: {
      type: String,
      default: "Unknown",
    },

    lastHealthCheck: {
      type: Date,
      default: null,
    },

    healthProblems: {
      type: [String],
      default: [],
    },

    healthTips: {
      type: [String],
      default: [],
    },

    aiInsight: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PREVENT MONGOOSE OVERWRITE ERROR
// ==========================================

const Plant =
  mongoose.models.Plant ||
  mongoose.model("Plant", plantSchema);

export default Plant;