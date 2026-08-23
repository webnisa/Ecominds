import express from "express";

import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
} from "../controllers/todoController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  createTodo
);

router.get(
  "/",
  requireAuth,
  getTodos
);

router.patch(
  "/:todoId/toggle",
  requireAuth,
  toggleTodo
);

router.delete(
  "/:todoId",
  requireAuth,
  deleteTodo
);

export default router;