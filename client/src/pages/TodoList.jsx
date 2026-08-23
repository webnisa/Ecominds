import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import {
  Plus,
  Trash2,
  Check,
  Clock,
  Bell,
} from "lucide-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

export default function TodoList() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // FETCH TODOS
  // ==========================================================

  const fetchTodos = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `${BACKEND_URL}/api/todos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTodos(response.data.todos || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch todos:",
        error
      );
    }
  };

  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchTodos();
    }
  }, [isLoaded, isSignedIn]);

  // ==========================================================
  // ADD TODO
  // ==========================================================

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task.");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      const response = await axios.post(
        `${BACKEND_URL}/api/todos`,
        {
          title,
          description,
          reminderAt:
            reminderAt || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTodos((prev) => [
          response.data.todo,
          ...prev,
        ]);

        setTitle("");
        setDescription("");
        setReminderAt("");
      }
    } catch (error) {
      console.error(
        "Add todo error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add task."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // TOGGLE
  // ==========================================================

  const handleToggle = async (todoId) => {
    try {
      const token = await getToken();

      const response = await axios.patch(
        `${BACKEND_URL}/api/todos/${todoId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === todoId
              ? response.data.todo
              : todo
          )
        );
      }
    } catch (error) {
      console.error(
        "Toggle todo error:",
        error
      );
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (todoId) => {
    try {
      const token = await getToken();

      await axios.delete(
        `${BACKEND_URL}/api/todos/${todoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos((prev) =>
        prev.filter(
          (todo) => todo._id !== todoId
        )
      );
    } catch (error) {
      console.error(
        "Delete todo error:",
        error
      );
    }
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatReminder = (date) => {
    if (!date) {
      return "No reminder";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 text-center">
        Please login to use your task list.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-green-100 p-3">
            <Check
              className="text-green-600"
              size={26}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My To-Do List
            </h1>

            <p className="text-gray-500">
              Add anything you need to remember 🌱
            </p>
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* ADD FORM */}
      {/* ================================================== */}

      <form
        onSubmit={handleAddTodo}
        className="mb-8 rounded-3xl border border-green-100 bg-white p-5 shadow-sm"
      >

        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Add New Task
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          {/* TITLE */}

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="What do you need to do?"
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
          />

          {/* REMINDER */}

          <div className="relative">

            <Clock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) =>
                setReminderAt(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-green-500"
            />

          </div>

        </div>

        {/* DESCRIPTION */}

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Optional description..."
          rows="3"
          className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
        />

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          <Plus size={19} />

          {loading
            ? "Adding..."
            : "Add Task"}
        </button>

      </form>

      {/* ================================================== */}
      {/* TASK LIST */}
      {/* ================================================== */}

      <div className="space-y-4">

        {todos.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <Check
              size={55}
              className="mx-auto mb-4 text-green-300"
            />

            <h3 className="text-xl font-bold text-gray-700">
              No tasks yet
            </h3>

            <p className="mt-2 text-gray-500">
              Add your first task above.
            </p>

          </div>

        ) : (

          todos.map((todo) => (

            <div
              key={todo._id}
              className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
                todo.completed
                  ? "border-green-100 opacity-70"
                  : "border-gray-100"
              }`}
            >

              {/* LEFT */}

              <div className="flex min-w-0 items-start gap-4">

                <button
                  onClick={() =>
                    handleToggle(todo._id)
                  }
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    todo.completed
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {todo.completed && (
                    <Check size={16} />
                  )}
                </button>

                <div className="min-w-0">

                  <h3
                    className={`font-semibold ${
                      todo.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </h3>

                  {todo.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {todo.description}
                    </p>
                  )}

                  {todo.reminderAt && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">

                      <Bell size={15} />

                      <span>
                        {formatReminder(
                          todo.reminderAt
                        )}
                      </span>

                    </div>
                  )}

                </div>

              </div>

              {/* DELETE */}

              <button
                onClick={() =>
                  handleDelete(todo._id)
                }
                className="self-end rounded-xl p-2 text-red-500 hover:bg-red-50 sm:self-auto"
              >
                <Trash2 size={19} />
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}