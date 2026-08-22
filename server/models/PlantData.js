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
      required: true,
    },

    temperature: {
      type: Number,
      required: true,
    },

    humidity: {
      type: Number,
      required: true,
    },

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

const PlantData = mongoose.model(
  "PlantData",
  plantDataSchema
);

export default PlantData;