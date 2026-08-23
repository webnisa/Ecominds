import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: [
        "WATERING",
        "MISSED_WATERING",
        "HEALTH",
        "GENERAL",
      ],
      default: "WATERING",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
  type: Boolean,
  default: false,
},

status: {
  type: String,
  enum: ["pending", "completed", "missed"],
  default: "pending",
},

dueAt: {
  type: Date,
  default: Date.now,
},


    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder =
  mongoose.models.Reminder ||
  mongoose.model("Reminder", reminderSchema);

export default Reminder;