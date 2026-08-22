import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
  },

  email: {
    type: String,
  },

  points: {
    type: Number,
    default: 0,
  },

  streak: {
    type: Number,
    default: 0,
  },

  lastCareDate: {
    type: Date,
    default: null,
  },

  plantsCount: {
    type: Number,
    default: 0,
  },

}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;