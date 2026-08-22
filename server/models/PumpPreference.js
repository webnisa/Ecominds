import mongoose from "mongoose";

const pumpPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    mode: {
      type: String,
      enum: [
        "manual",
        "automatic",
        "ask_every_time",
      ],
      default: "ask_every_time",
    },

    autoWateringEnabled: {
      type: Boolean,
      default: false,
    },

    defaultDuration: {
      type: Number,
      default: 10,
      min: 1,
      max: 120,
    },
  },
  {
    timestamps: true,
  }
);

const PumpPreference = mongoose.model(
  "PumpPreference",
  pumpPreferenceSchema
);

export default PumpPreference;