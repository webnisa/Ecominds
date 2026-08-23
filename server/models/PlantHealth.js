import mongoose from "mongoose";

const plantHealthSchema = new mongoose.Schema(
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
    // HEALTH SCORE
    // ==========================================

    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "healthy",
        "warning",
        "critical",
        "unknown",
      ],
      default: "unknown",
    },

    // ==========================================
    // RISK
    // ==========================================

    riskLevel: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "unknown",
      ],
      default: "unknown",
    },

    // ==========================================
    // AI ANALYSIS
    // ==========================================

    analysis: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },

    // ==========================================
    // SENSOR FACTORS
    // ==========================================

    factors: {
      moisture: {
        type: String,
        default: "",
      },

      temperature: {
        type: String,
        default: "",
      },

      humidity: {
        type: String,
        default: "",
      },

      sunlight: {
        type: String,
        default: "",
      },

      watering: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // DATA POINTS
    // ==========================================

    dataPointsUsed: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // GENERATED
    // ==========================================

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PREVENT MONGOOSE OVERWRITE ERROR
// ==========================================

const PlantHealth =
  mongoose.models.PlantHealth ||
  mongoose.model("PlantHealth", plantHealthSchema);

export default PlantHealth;