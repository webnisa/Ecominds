import Todo from "../models/Todo.js";

// ============================================================
// CREATE TODO
// ============================================================

export const createTodo = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      title,
      description,
      reminderAt,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    const todo = await Todo.create({
      userId,
      title: title.trim(),
      description: description?.trim() || "",
      reminderAt: reminderAt
        ? new Date(reminderAt)
        : null,
    });

    return res.status(201).json({
      success: true,
      message: "Task added successfully 🌱",
      todo,
    });
  } catch (error) {
    console.error("Create todo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

// ============================================================
// GET TODOS
// ============================================================

export const getTodos = async (req, res) => {
  try {
    const userId = req.userId;

    const todos = await Todo.find({
      userId,
    }).sort({
      completed: 1,
      reminderAt: 1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      todos,
    });
  } catch (error) {
    console.error("Get todos error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
    });
  }
};

// ============================================================
// COMPLETE / UNCOMPLETE TODO
// ============================================================

export const toggleTodo = async (req, res) => {
  try {
    const userId = req.userId;
    const { todoId } = req.params;

    const todo = await Todo.findOne({
      _id: todoId,
      userId,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    todo.completed = !todo.completed;

    todo.completedAt = todo.completed
      ? new Date()
      : null;

    await todo.save();

    return res.json({
      success: true,
      message: todo.completed
        ? "Task completed ✅"
        : "Task marked incomplete.",
      todo,
    });
  } catch (error) {
    console.error("Toggle todo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
};

// ============================================================
// DELETE TODO
// ============================================================

export const deleteTodo = async (req, res) => {
  try {
    const userId = req.userId;
    const { todoId } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: todoId,
      userId,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete todo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task.",
    });
  }
};