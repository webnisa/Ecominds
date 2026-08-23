import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@clerk/clerk-react";

import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Leaf,
  AlertTriangle,
  RefreshCw,
  Sprout,
  HeartPulse,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getAllPlantsMonitoring,
} from "../api/monitoringApi";


// ============================================================
// MAIN PAGE
// ============================================================

const History = () => {

  const {
    getToken,
  } = useAuth();

  const [
    monitoringData,
    setMonitoringData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // FETCH ALL PLANTS
  // ==========================================================

  const fetchMonitoring =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          await getToken();

        const data =
          await getAllPlantsMonitoring(
            token
          );

        if (!data.success) {
          throw new Error(
            data.message ||
              "Failed to load monitoring data"
          );
        }

        setMonitoringData(data);

      } catch (err) {

        console.error(
          "❌ Monitoring error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err.message ||
            "Failed to load monitoring data."
        );

      } finally {
        setLoading(false);
      }
    };


  // ==========================================================
  // LOAD ON PAGE OPEN
  // ==========================================================

  useEffect(() => {
    fetchMonitoring();
  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">

        <div className="text-center">

          <RefreshCw
            size={42}
            className="animate-spin text-green-600 mx-auto"
          />

          <p className="mt-4 text-gray-600">
            Loading plant monitoring...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 p-6">

        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm">

          <AlertTriangle
            size={48}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-bold text-gray-800">
            Monitoring Error
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={
              fetchMonitoring
            }
            className="mt-6 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const summary =
    monitoringData?.summary || {
      totalPlants: 0,
      healthyPlants: 0,
      warningPlants: 0,
      criticalPlants: 0,
      plantsNeedWater: 0,
    };

  const plants =
    monitoringData?.plants || [];


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">

                <Activity
                  size={28}
                  className="text-green-600"
                />

              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  Plant Monitoring
                </h1>

                <p className="text-gray-500">
                  Monitor all your plants in one place
                </p>

              </div>

            </div>

          </div>


          <button
            onClick={
              fetchMonitoring
            }
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 font-medium"
          >

            <RefreshCw
              size={18}
            />

            Refresh

          </button>

        </div>


        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">

          <SummaryCard
            icon={
              <Sprout />
            }
            title="Total Plants"
            value={
              summary.totalPlants
            }
          />

          <SummaryCard
            icon={
              <HeartPulse />
            }
            title="Healthy"
            value={
              summary.healthyPlants
            }
          />

          <SummaryCard
            icon={
              <AlertTriangle />
            }
            title="Warning"
            value={
              summary.warningPlants
            }
          />

          <SummaryCard
            icon={
              <Activity />
            }
            title="Critical"
            value={
              summary.criticalPlants
            }
          />

          <SummaryCard
            icon={
              <Droplets />
            }
            title="Need Water"
            value={
              summary.plantsNeedWater
            }
          />

        </div>


        {/* ====================================================
            NO PLANTS
        ==================================================== */}

        {plants.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

            <Leaf
              size={55}
              className="mx-auto text-green-600 mb-4"
            />

            <h2 className="text-2xl font-bold text-gray-800">
              No Plants Found
            </h2>

            <p className="text-gray-500 mt-2">
              Add a plant to start monitoring it.
            </p>

          </div>
        )}


        {/* ====================================================
            ALL PLANTS
        ==================================================== */}

        <div className="space-y-7">

          {plants.map(
            (item) => (
              <PlantMonitoringCard
                key={
                  item.plant.id
                }
                item={item}
              />
            )
          )}

        </div>

      </div>

    </div>
  );
};


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

      <div className="text-green-600 mb-3">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-3xl font-bold text-gray-800 mt-1">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// PLANT MONITORING CARD
// ============================================================

function PlantMonitoringCard({
  item,
}) {

  const plant =
    item.plant;

  const latest =
    item.latestSensor;

  const history =
    item.history || [];


  // ==========================================================
  // HEALTH
  // ==========================================================

  const healthScore =
    plant.healthScore !== null &&
    plant.healthScore !== undefined
      ? Number(
          plant.healthScore
        )
      : null;


  let healthLabel =
    "Monitoring";

  let healthClass =
    "bg-gray-100 text-gray-700";

  if (
    healthScore !== null
  ) {

    if (healthScore >= 75) {
      healthLabel =
        "Healthy";

      healthClass =
        "bg-green-100 text-green-700";

    } else if (
      healthScore >= 40
    ) {
      healthLabel =
        "Warning";

      healthClass =
        "bg-yellow-100 text-yellow-700";

    } else {
      healthLabel =
        "Critical";

      healthClass =
        "bg-red-100 text-red-700";
    }
  }


  // ==========================================================
  // CHART DATA
  // ==========================================================

  const chartData =
    history.map(
      (reading) => ({
        time: new Date(
          reading.recordedAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        ),

        moisture:
          reading.soilMoisture,

        temperature:
          reading.temperature,

        humidity:
          reading.humidity,

        light:
          reading.light,
      })
    );


  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">


      {/* ======================================================
          PLANT HEADER
      ====================================================== */}

      <div className="p-6 border-b border-gray-100">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

              <Leaf
                size={34}
                className="text-green-600"
              />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold text-gray-800">
                  {plant.plantName}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${healthClass}`}
                >
                  {healthLabel}
                </span>

              </div>

              <p className="text-gray-500 mt-1">
                {plant.plantType}
              </p>

              {plant.location && (
                <p className="text-sm text-gray-400 mt-1">
                  📍 {plant.location}
                </p>
              )}

            </div>

          </div>


          {/* HEALTH SCORE */}

          <div className="text-left lg:text-right">

            <p className="text-sm text-gray-500">
              Health Score
            </p>

            <p className="text-4xl font-bold text-green-600">

              {healthScore !== null
                ? healthScore
                : "--"}

              {healthScore !==
                null && (
                <span className="text-lg text-gray-400">
                  /100
                </span>
              )}

            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          SENSOR CARDS
      ====================================================== */}

      <div className="p-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <SensorCard
            icon={
              <Droplets />
            }
            title="Soil Moisture"
            value={
              latest?.soilMoisture ??
              "--"
            }
            unit="%"
          />

          <SensorCard
            icon={
              <Thermometer />
            }
            title="Temperature"
            value={
              latest?.temperature ??
              "--"
            }
            unit="°C"
          />

          <SensorCard
            icon={
              <Wind />
            }
            title="Humidity"
            value={
              latest?.humidity ??
              "--"
            }
            unit="%"
          />

          <SensorCard
            icon={
              <Sun />
            }
            title="Light"
            value={
              latest?.light ??
              "--"
            }
            unit=""
          />

        </div>


        {/* ====================================================
            LAST UPDATE
        ==================================================== */}

        {latest && (
          <p className="text-sm text-gray-400 mt-5">

            Last sensor update:{" "}

            {new Date(
              latest.recordedAt
            ).toLocaleString(
              "en-IN"
            )}

          </p>
        )}


        {/* ====================================================
            GRAPHS
        ==================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">

          <MiniChart
            title="💧 Soil Moisture"
            data={chartData}
            dataKey="moisture"
            unit="%"
          />

          <MiniChart
            title="🌡️ Temperature"
            data={chartData}
            dataKey="temperature"
            unit="°C"
          />

          <MiniChart
            title="💨 Humidity"
            data={chartData}
            dataKey="humidity"
            unit="%"
          />

          <MiniChart
            title="☀️ Light"
            data={chartData}
            dataKey="light"
            unit=""
          />

        </div>


        {/* ====================================================
            WATERING STATUS
        ==================================================== */}

        <WateringStatus
          latest={latest}
        />

      </div>

    </div>
  );
}


// ============================================================
// SENSOR CARD
// ============================================================

function SensorCard({
  icon,
  title,
  value,
  unit,
}) {

  return (
    <div className="bg-green-50 rounded-2xl p-5">

      <div className="text-green-600 mb-3">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold text-gray-800 mt-1">

        {value}

        <span className="text-sm font-medium text-gray-500 ml-1">
          {unit}
        </span>

      </p>

    </div>
  );
}


// ============================================================
// MINI CHART
// ============================================================

function MiniChart({
  title,
  data,
  dataKey,
  unit,
}) {

  return (
    <div className="border border-gray-100 rounded-2xl p-4">

      <h3 className="font-bold text-gray-800 mb-4">
        {title}
      </h3>

      {data.length === 0 ? (

        <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
          No sensor data yet
        </div>

      ) : (

        <div className="h-52">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={data}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="time"
                fontSize={11}
              />

              <YAxis
                fontSize={11}
              />

              <Tooltip
                formatter={(
                  value
                ) =>
                  `${value}${unit}`
                }
              />

              <Line
                type="monotone"
                dataKey={
                  dataKey
                }
                strokeWidth={3}
                dot={false}
                connectNulls
              />

            </LineChart>

          </ResponsiveContainer>

        </div>
      )}

    </div>
  );
}


// ============================================================
// WATERING STATUS
// ============================================================

function WateringStatus({
  latest,
}) {

  if (!latest) {
    return (
      <div className="mt-6 p-5 rounded-2xl bg-gray-50">

        <p className="font-semibold text-gray-700">
          💧 Waiting for sensor data
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Once the IoT sensor sends data,
          watering status will appear here.
        </p>

      </div>
    );
  }

  const moisture =
    latest.soilMoisture;


  if (
    moisture !== null &&
    moisture !== undefined &&
    Number(moisture) < 30
  ) {

    return (
      <div className="mt-6 p-5 rounded-2xl bg-red-50 border border-red-100">

        <div className="flex items-start gap-3">

          <Droplets
            className="text-red-500 mt-1"
          />

          <div>

            <p className="font-bold text-red-700">
              💧 Watering may be needed
            </p>

            <p className="text-sm text-red-600 mt-1">
              Soil moisture is currently{" "}
              {moisture}%.
              Check the plant and water
              according to its needs.
            </p>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="mt-6 p-5 rounded-2xl bg-green-50 border border-green-100">

      <div className="flex items-start gap-3">

        <Droplets
          className="text-green-600 mt-1"
        />

        <div>

          <p className="font-bold text-green-700">
            💧 Moisture looks okay
          </p>

          <p className="text-sm text-green-600 mt-1">
            Current soil moisture is{" "}
            {moisture ?? "--"}%.
            Continue monitoring the plant.
          </p>

        </div>

      </div>

    </div>
  );
}


export default History;