import Reminder from "../models/Reminder.js";
import Plant from "../models/Plant.js";

// ============================================================
// GET USER REMINDERS
// ============================================================

export const getReminders = async (req, res) => {
  try {
    const clerkId = req.userId;

    const reminders = await Reminder.find({
      userId: clerkId,
    })
      .populate(
        "plantId",
        "plantName plantType image"
      )
      .sort({
        createdAt: -1,
      })
      .limit(100);

    return res.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error(
      "❌ Get reminders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
    });
  }
};

// ============================================================
// UNREAD COUNT
// ============================================================

export const getUnreadReminderCount = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    const count = await Reminder.countDocuments({
      userId: clerkId,
      isRead: false,
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "❌ Reminder count error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get reminder count",
    });
  }
};

// ============================================================
// MARK ONE REMINDER AS READ
// ============================================================

export const markReminderRead = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;
    const { id } = req.params;

    const reminder =
      await Reminder.findOneAndUpdate(
        {
          _id: id,
          userId: clerkId,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    return res.json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error(
      "❌ Mark reminder error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update reminder",
    });
  }
};

// ============================================================
// MARK ALL AS READ
// ============================================================

export const markAllRemindersRead = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    await Reminder.updateMany(
      {
        userId: clerkId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.json({
      success: true,
      message: "All reminders marked as read",
    });
  } catch (error) {
    console.error(
      "❌ Mark all reminders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark reminders as read",
    });
  }
};

// ============================================================
// CREATE REMINDER
// ============================================================

export const createReminder = async (
  req,
  res
) => {
  try {
    const clerkId = req.userId;

    const {
      plantId,
      type,
      title,
      message,
      dueAt,
    } = req.body;

    if (!plantId || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "plantId, title and message are required",
      });
    }

    const plant = await Plant.findOne({
      _id: plantId,
      userId: clerkId,
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    const reminder = await Reminder.create({
      userId: clerkId,
      plantId,
      type: type || "GENERAL",
      title,
      message,
      dueAt: dueAt || new Date(),
    });

    return res.status(201).json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error(
      "❌ Create reminder error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create reminder",
    });
  }
};

// ============================================================
// MARK REMINDER AS COMPLETED
// ============================================================
 export const completeReminder = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { id } = req.params;

    const reminder =
      await Reminder.findOneAndUpdate(
        {
          _id: id,
          userId: clerkId,
        },
        {
          isRead: true,
          status: "completed",
        },
        {
          new: true,
        }
      );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    return res.json({
      success: true,
      message: "Reminder completed",
      reminder,
    });
  } catch (error) {
    console.error(
      "❌ Complete reminder error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to complete reminder",
    });
  }
};