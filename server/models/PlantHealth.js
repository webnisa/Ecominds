import mongoose from "mongoose";

const plantHealthSchema = new mongoose.Schema(
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

    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

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

    analysis: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },

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

      watering: {
        type: String,
        default: "",
      },
    },

    dataPointsUsed: {
      type: Number,
      default: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PlantHealth = mongoose.model(
  "PlantHealth",
  plantHealthSchema
);

export default PlantHealth;