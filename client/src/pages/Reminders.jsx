import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Sprout,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { useAuth } from "@clerk/clerk-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

function Reminders() {
  const navigate = useNavigate();

  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [completingId, setCompletingId] =
    useState(null);

  // =========================================================
  // FETCH REMINDERS
  // =========================================================

  const fetchReminders = async () => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    try {
      setError("");

      const token = await getToken();

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/reminders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "🌱 Reminder page response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch reminders"
        );
      }

      if (Array.isArray(data.reminders)) {
        setReminders(data.reminders);
      } else if (Array.isArray(data)) {
        setReminders(data);
      } else {
        setReminders([]);
      }
    } catch (error) {
      console.error(
        "❌ Reminder fetch error:",
        error
      );

      setError(
        error.message ||
          "Failed to load reminders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchReminders();
    }
  }, [isLoaded, isSignedIn]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReminders();
  };

  // =========================================================
  // COMPLETE REMINDER
  // =========================================================

  const handleCompleteReminder = async (
    reminderId
  ) => {
    try {
      setCompletingId(reminderId);
      setError("");

      const token = await getToken();

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/reminders/${reminderId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "✅ Complete reminder response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to complete reminder"
        );
      }

      // Reload reminders
      await fetchReminders();
    } catch (error) {
      console.error(
        "❌ Complete reminder error:",
        error
      );

      setError(
        error.message ||
          "Failed to complete reminder"
      );
    } finally {
      setCompletingId(null);
    }
  };

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================

  const getStatus = (reminder) => {
    const status =
      reminder.status || "";

    if (
      status.toLowerCase() ===
        "completed" ||
      status.toLowerCase() === "done"
    ) {
      return "completed";
    }

    if (
      status.toLowerCase() ===
        "missed" ||
      status.toLowerCase() === "overdue"
    ) {
      return "missed";
    }

    return "pending";
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredReminders =
    reminders.filter((reminder) => {
      const status =
        getStatus(reminder);

      if (activeFilter === "all") {
        return true;
      }

      return status === activeFilter;
    });

  // =========================================================
  // COUNTS
  // =========================================================

  const pendingCount =
    reminders.filter(
      (item) =>
        getStatus(item) === "pending"
    ).length;

  const missedCount =
    reminders.filter(
      (item) =>
        getStatus(item) === "missed"
    ).length;

  const completedCount =
    reminders.filter(
      (item) =>
        getStatus(item) === "completed"
    ).length;

  // =========================================================
  // DATE
  // =========================================================

  const getReminderDate = (
    reminder
  ) => {
    const value =
      reminder.dueAt ||
      reminder.reminderDate ||
      reminder.dueDate ||
      reminder.scheduledFor ||
      reminder.createdAt;

    if (!value) {
      return "Date not available";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================================================
  // PLANT NAME
  // =========================================================

  const getPlantName = (
    reminder
  ) => {
    return (
      reminder.plantName ||
      reminder.plant?.plantName ||
      reminder.plant?.name ||
      reminder.plantId?.plantName ||
      "Your Plant"
    );
  };

  // =========================================================
  // MESSAGE
  // =========================================================

  const getMessage = (
    reminder
  ) => {
    return (
      reminder.message ||
      reminder.description ||
      reminder.text ||
      "Your plant needs attention."
    );
  };

  // =========================================================
  // TYPE
  // =========================================================

  const getType = (
    reminder
  ) => {
    return (
      reminder.type ||
      reminder.reminderType ||
      "GENERAL"
    );
  };

  // =========================================================
  // ICON
  // =========================================================

  const getIcon = (
    reminder
  ) => {
    const type =
      getType(reminder)
        .toLowerCase();

    if (
      type.includes("water")
    ) {
      return (
        <Droplets size={20} />
      );
    }

    if (
      type.includes("health")
    ) {
      return (
        <Sprout size={20} />
      );
    }

    return (
      <Bell size={20} />
    );
  };

  // =========================================================
  // STATUS UI
  // =========================================================

  const getStatusUI = (
    reminder
  ) => {
    const status =
      getStatus(reminder);

    if (
      status === "completed"
    ) {
      return {
        label: "Completed",
        className:
          "bg-[#e4f4e8] text-[#267342]",
      };
    }

    if (
      status === "missed"
    ) {
      return {
        label: "Missed",
        className:
          "bg-[#feecec] text-[#dc2626]",
      };
    }

    return {
      label: "Pending",
      className:
        "bg-[#fff5df] text-[#b76b00]",
    };
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#f5f9f5]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-10
              h-10
              mx-auto
              rounded-full
              border-4
              border-[#dceadf]
              border-t-[#166534]
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-[#718078]
            "
          >
            Loading reminders...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main
      className="
        min-h-screen
        bg-[#f5f9f5]
      "
    >

      {/* HEADER */}

      <section
        className="
          px-4
          sm:px-6
          md:px-8
          pt-7
        "
      >
        <div
          className="
            max-w-[1200px]
            mx-auto
          "
        >

          {/* BACK */}

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              items-center
              gap-2
              text-[13px]
              font-semibold
              text-[#5d7665]
              hover:text-[#14532d]
            "
          >
            <ArrowLeft size={17} />

            Back
          </button>

          {/* TITLE */}

          <div
            className="
              mt-5
              flex
              flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-4
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#e3f1e6]
                    flex
                    items-center
                    justify-center
                    text-[#166534]
                  "
                >
                  <Bell size={22} />
                </div>

                <div>
                  <h1
                    className="
                      text-[28px]
                      sm:text-[34px]
                      font-bold
                      text-[#123d26]
                    "
                  >
                    Reminders
                  </h1>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      text-[#718078]
                    "
                  >
                    Stay on top of your
                    plant care
                  </p>
                </div>
              </div>
            </div>

            {/* REFRESH */}

            <button
              onClick={
                handleRefresh
              }
              disabled={refreshing}
              className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-white
                border
                border-[#d6e5d9]
                text-[#526c5a]
                text-[12px]
                font-semibold
                hover:bg-[#eef6ef]
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* SUMMARY */}

      <section
        className="
          px-4
          sm:px-6
          md:px-8
          mt-6
        "
      >
        <div
          className="
            max-w-[1200px]
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          "
        >
          <SummaryCard
            icon={
              <Clock3 size={20} />
            }
            title="Pending"
            value={pendingCount}
            iconClass="
              bg-[#fff4df]
              text-[#c47700]
            "
          />

          <SummaryCard
            icon={
              <AlertTriangle
                size={20}
              />
            }
            title="Missed"
            value={missedCount}
            iconClass="
              bg-[#feecec]
              text-[#dc2626]
            "
          />

          <SummaryCard
            icon={
              <CheckCircle2
                size={20}
              />
            }
            title="Completed"
            value={completedCount}
            iconClass="
              bg-[#e4f4e8]
              text-[#267342]
            "
          />
        </div>
      </section>

      {/* FILTER */}

      <section
        className="
          px-4
          sm:px-6
          md:px-8
          mt-6
        "
      >
        <div
          className="
            max-w-[1200px]
            mx-auto
            flex
            gap-2
            overflow-x-auto
            pb-1
          "
        >
          <FilterButton
            active={
              activeFilter ===
              "all"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All
          </FilterButton>

          <FilterButton
            active={
              activeFilter ===
              "pending"
            }
            onClick={() =>
              setActiveFilter(
                "pending"
              )
            }
          >
            Pending
          </FilterButton>

          <FilterButton
            active={
              activeFilter ===
              "missed"
            }
            onClick={() =>
              setActiveFilter(
                "missed"
              )
            }
          >
            Missed
          </FilterButton>

          <FilterButton
            active={
              activeFilter ===
              "completed"
            }
            onClick={() =>
              setActiveFilter(
                "completed"
              )
            }
          >
            Completed
          </FilterButton>
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <section
          className="
            px-4
            sm:px-6
            md:px-8
            mt-5
          "
        >
          <div
            className="
              max-w-[1200px]
              mx-auto
              rounded-2xl
              bg-[#fff1f1]
              border
              border-[#f3cccc]
              px-5
              py-4
              text-sm
              text-[#b42323]
            "
          >
            ❌ {error}
          </div>
        </section>
      )}

      {/* REMINDERS */}

      <section
        className="
          px-4
          sm:px-6
          md:px-8
          py-6
        "
      >
        <div
          className="
            max-w-[1200px]
            mx-auto
          "
        >

          {filteredReminders.length ===
          0 ? (
            <div
              className="
                bg-white
                border
                border-[#d9e7dc]
                rounded-[26px]
                p-10
                text-center
              "
            >
              <div
                className="
                  w-16
                  h-16
                  mx-auto
                  rounded-2xl
                  bg-[#e8f3ea]
                  flex
                  items-center
                  justify-center
                  text-3xl
                "
              >
                🌱
              </div>

              <h2
                className="
                  mt-5
                  text-[18px]
                  font-bold
                  text-[#163d27]
                "
              >
                No reminders
              </h2>

              <p
                className="
                  mt-2
                  text-[12px]
                  text-[#7b877f]
                "
              >
                You don't have any
                reminders in this
                category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredReminders.map(
                (
                  reminder,
                  index
                ) => {
                  const status =
                    getStatus(
                      reminder
                    );

                  const statusUI =
                    getStatusUI(
                      reminder
                    );

                  return (
                    <div
                      key={
                        reminder._id ||
                        reminder.id ||
                        index
                      }
                      className="
                        bg-white
                        border
                        border-[#d9e7dc]
                        rounded-[24px]
                        p-5
                        sm:p-6
                        hover:shadow-md
                        transition
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          md:flex-row
                          md:items-center
                          gap-5
                        "
                      >

                        {/* ICON */}

                        <div
                          className="
                            w-12
                            h-12
                            shrink-0
                            rounded-xl
                            bg-[#e5f3e8]
                            text-[#267342]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {getIcon(
                            reminder
                          )}
                        </div>

                        {/* CONTENT */}

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <h2
                              className="
                                text-[16px]
                                font-bold
                                text-[#163d27]
                              "
                            >
                              {reminder.title ||
                                getPlantName(
                                  reminder
                                )}
                            </h2>

                            <span
                              className={`
                                px-2.5
                                py-1
                                rounded-full
                                text-[9px]
                                font-semibold
                                ${statusUI.className}
                              `}
                            >
                              {
                                statusUI.label
                              }
                            </span>
                          </div>

                          <p
                            className="
                              mt-2
                              text-[12px]
                              leading-5
                              text-[#68786d]
                            "
                          >
                            {getMessage(
                              reminder
                            )}
                          </p>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                text-[#7c8981]
                              "
                            >
                              <CalendarDays
                                size={14}
                              />

                              {getReminderDate(
                                reminder
                              )}
                            </div>

                            {(
                              reminder.location ||
                              reminder.plant?.location
                            ) && (
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[10px]
                                  text-[#7c8981]
                                "
                              >
                                <MapPin
                                  size={14}
                                />

                                {reminder.location ||
                                  reminder
                                    .plant
                                    ?.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div
                          className="
                            md:w-[150px]
                            shrink-0
                            flex
                            md:flex-col
                            items-center
                            justify-between
                            md:items-end
                            gap-3
                          "
                        >
                          <span
                            className="
                              text-[10px]
                              font-medium
                              text-[#829088]
                              capitalize
                            "
                          >
                            {getType(
                              reminder
                            )}
                          </span>

                          {status ===
                            "pending" && (
                            <button
                              onClick={() =>
                                handleCompleteReminder(
                                  reminder._id
                                )
                              }
                              disabled={
                                completingId ===
                                reminder._id
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-[#166534]
                                hover:bg-[#14532d]
                                text-white
                                text-[10px]
                                font-semibold
                                disabled:opacity-60
                              "
                            >
                              <CheckCircle2
                                size={14}
                              />

                              {completingId ===
                              reminder._id
                                ? "Saving..."
                                : "Mark Done"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}

      <footer
        className="
          border-t
          border-[#d9e7dc]
          bg-white
          py-5
        "
      >
        <p
          className="
            text-center
            text-[10px]
            text-[#7b877f]
          "
        >
          🌱 EcoMinds — Smart Plant Care
        </p>
      </footer>
    </main>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  icon,
  title,
  value,
  iconClass,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-[#d9e7dc]
        rounded-[20px]
        p-5
        flex
        items-center
        gap-4
      "
    >
      <div
        className={`
          w-11
          h-11
          rounded-xl
          flex
          items-center
          justify-center
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-[11px]
            text-[#7b877f]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[24px]
            font-bold
            text-[#163d27]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// FILTER BUTTON
// ============================================================

function FilterButton({
  children,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        shrink-0
        px-5
        py-2.5
        rounded-xl
        text-[11px]
        font-semibold
        transition

        ${
          active
            ? "bg-[#166534] text-white"
            : "bg-white text-[#68786d] border border-[#d9e7dc] hover:bg-[#eef6ef]"
        }
      `}
    >
      {children}
    </button>
  );
}

export default Reminders;