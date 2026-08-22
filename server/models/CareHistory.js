import mongoose from "mongoose";

const careHistorySchema = new mongoose.Schema(
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

    action: {
      type: String,
      enum: [
        "watered",
        "fertilized",
        "pruned",
        "checked",
        "other",
      ],
      required: true,
    },

    pointsEarned: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    performedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CareHistory = mongoose.model(
  "CareHistory",
  careHistorySchema
);

export default CareHistory;