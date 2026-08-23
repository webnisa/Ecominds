function ReminderCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Reminders
        </h2>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
          1 pending
        </span>
      </div>

      <div className="rounded-xl bg-blue-50 p-4">
        <p className="font-medium">
          💧 Water your Money Plant
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Soil moisture is getting low.
        </p>

        <div className="mt-4 flex gap-3">
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
            Water Now
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm">
            Use Pump
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReminderCard;