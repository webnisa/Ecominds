import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCareDate: {
      type: Date,
      default: null,
    },

    sevenDayBonusGiven: {
      type: Boolean,
      default: false,
    },

    fourteenDayBonusGiven: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Points = mongoose.model(
  "Points",
  pointsSchema
);

export default Points;