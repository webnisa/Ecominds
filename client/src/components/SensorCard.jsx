function SensorCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-green-600">
        Normal condition
      </p>
    </div>
  );
}

export default SensorCard;