function HealthCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            AI Plant Health
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Healthy 🌱
          </h2>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
          92
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Health score</span>
          <span>92%</span>
        </div>

        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: "92%" }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm text-gray-500">
        Your plant is currently in good condition.
        AI analysis is based on recent temperature,
        humidity and soil moisture history.
      </p>
    </div>
  );
}

export default HealthCard;