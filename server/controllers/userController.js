import User from "../models/User.js";
import UserStats from "../models/UserStats.js";
import Plant from "../models/Plant.js";
import CareHistory from "../models/CareHistory.js";
import Reminder from "../models/Reminder.js";


// ==========================================
// GET MY PROFILE
// ==========================================

export const getMyProfile = async (req, res) => {
  try {

    const clerkId = req.userId;


    // ==========================================
    // GET OR CREATE USER
    // ==========================================

    let user = await User.findOne({
      clerkId,
    });


    if (!user) {

      user = await User.create({
        clerkId,
      });

    }


    // ==========================================
    // GET OR CREATE USER STATS
    // ==========================================

    let stats =
      await UserStats.findOne({
        userId: clerkId,
      });


    if (!stats) {

      stats = await UserStats.create({

        userId: clerkId,

        totalPoints: 0,

        currentStreak: 0,

        longestStreak: 0,

        totalCareActions: 0,

        badges: [],

      });

    }


    // ==========================================
    // TOTAL PLANTS
    // ==========================================

    const totalPlants =
      await Plant.countDocuments({
        userId: clerkId,
      });


    // ==========================================
    // TOTAL CARE ACTIONS
    // ==========================================

    const totalCareActions =
      await CareHistory.countDocuments({
        userId: clerkId,
      });


    // ==========================================
    // UNREAD REMINDERS
    // ==========================================

    const unreadReminders =
      await Reminder.countDocuments({
        userId: clerkId,

        isRead: false,
      });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({

      success: true,

      user,

      stats: {

        totalPoints:
          stats.totalPoints,

        currentStreak:
          stats.currentStreak,

        longestStreak:
          stats.longestStreak,

        totalCareActions:
          totalCareActions,

        level:
          stats.level,

        badges:
          stats.badges,

      },

      dashboard: {

        totalPlants,

        unreadReminders,

      },

    });

  } catch (error) {

    console.error(
      "Get profile error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to get user profile",

    });

  }
};