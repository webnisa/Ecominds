import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

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
  },
  {
    timestamps: true,
  }
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;