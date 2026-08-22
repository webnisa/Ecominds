import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
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

    totalCareActions: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCareDate: {
      type: Date,
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },

    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserStats = mongoose.model(
  "UserStats",
  userStatsSchema
);

export default UserStats;