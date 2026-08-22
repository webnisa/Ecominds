import mongoose from "mongoose";

const healthHistorySchema = new mongoose.Schema(
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
      required: true,
    },

    healthStatus: {
      type: String,
      enum: [
        "healthy",
        "warning",
        "critical",
      ],
      required: true,
    },

    riskLevel: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
      ],
      required: true,
    },

    prediction: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },

    analysis: {
      type: String,
      default: "",
    },

    sensorSummary: {
      soilMoisture: Number,
      temperature: Number,
      humidity: Number,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const HealthHistory = mongoose.model(
  "HealthHistory",
  healthHistorySchema
);

export default HealthHistory;