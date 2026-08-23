import {
  useEffect,
  useState,
} from "react";

import {
  Droplets,
  Thermometer,
  Cloud,
  Sun,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  useAuth,
} from "@clerk/clerk-react";

import {
  analyzePlantHealth,
} from "../api/aiApi";


function DailyMonitoring({
  plantId,
}) {

  const {
    getToken,
  } = useAuth();


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    health,
    setHealth,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  const runAnalysis =
    async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          await getToken();


        const data =
          await analyzePlantHealth({

            plantId,

            token,
          });


        setHealth(
          data.health
        );


      } catch (err) {

        console.error(
          "Health monitoring error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          "Unable to analyze plant health"
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    if (plantId) {

      runAnalysis();

    }

  }, [plantId]);


  const getStatusIcon =
    () => {

      if (
        health?.status ===
        "critical"
      ) {

        return (
          <AlertTriangle
            size={22}
            className="text-red-500"
          />
        );
      }


      if (
        health?.status ===
        "warning"
      ) {

        return (
          <AlertTriangle
            size={22}
            className="text-yellow-500"
          />
        );
      }


      return (
        <CheckCircle2
          size={22}
          className="text-green-500"
        />
      );
    };


  const getTrendIcon =
    () => {

      if (
        health?.trend ===
        "improving"
      ) {

        return (
          <TrendingUp
            size={18}
            className="text-green-500"
          />
        );
      }


      if (
        health?.trend ===
        "declining"
      ) {

        return (
          <TrendingDown
            size={18}
            className="text-red-500"
          />
        );
      }


      return (
        <Minus
          size={18}
          className="text-gray-400"
        />
      );
    };


  if (loading) {

    return (

      <div className="bg-white border border-[#DCEBE0] rounded-[28px] p-7">

        <div className="flex items-center justify-center py-12">

          <Loader2
            size={30}
            className="animate-spin text-[#49A86F]"
          />

          <span className="ml-3 text-[#59685F]">
            AI is checking your plant...
          </span>

        </div>

      </div>
    );
  }


  return (

    <div className="bg-white border border-[#DCEBE0] rounded-[28px] p-5 sm:p-7">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-[#EAF6ED] flex items-center justify-center">

            <Brain
              size={23}
              className="text-[#166534]"
            />

          </div>

          <div>

            <h2 className="font-bold text-[#123C2B] text-lg">

              Daily Plant Monitoring

            </h2>

            <p className="text-xs text-[#817D75]">

              AI analysis from recent sensor data

            </p>

          </div>

        </div>


        <button

          onClick={runAnalysis}

          className="text-sm font-semibold text-[#166534] hover:underline"

        >

          Refresh

        </button>

      </div>


      {error && (

        <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">

          <AlertTriangle
            size={18}
            className="text-red-500"
          />

          <p className="text-sm text-red-600">

            {error}

          </p>

        </div>
      )}


      {health && (

        <div className="mt-6 space-y-4">


          {/* HEALTH SCORE */}

          <div className="rounded-2xl bg-[#EFF7F1] p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                {getStatusIcon()}

                <div>

                  <p className="text-xs text-[#817D75]">

                    Current Plant Health

                  </p>

                  <p className="text-xl font-bold text-[#166534] capitalize">

                    {health.status}

                  </p>

                </div>

              </div>


              <div className="text-right">

                <p className="text-3xl font-bold text-[#166534]">

                  {health.healthScore}

                </p>

                <p className="text-xs text-gray-400">

                  / 100

                </p>

              </div>

            </div>


            {/* SCORE BAR */}

            <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">

              <div

                className="h-full bg-[#49A86F] rounded-full"

                style={{
                  width:
                    `${health.healthScore}%`,
                }}

              />

            </div>

          </div>


          {/* TREND */}

          <div className="rounded-2xl border border-[#DCEBE0] p-4 flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-400">

                Health Trend

              </p>

              <p className="font-semibold text-[#123C2B] capitalize">

                {health.trend}

              </p>

            </div>


            <div className="flex items-center gap-2">

              {getTrendIcon()}

              <span className="text-sm capitalize">

                {health.trend}

              </span>

            </div>

          </div>


          {/* RISK */}

          <div className="rounded-2xl border border-[#DCEBE0] p-4">

            <p className="text-xs text-gray-400">

              Risk Level

            </p>

            <p className="mt-1 font-bold capitalize">

              {health.riskLevel}

            </p>

          </div>


          {/* ANALYSIS */}

          <div className="rounded-2xl border border-[#DCEBE0] p-4">

            <p className="text-xs text-gray-400">

              AI Analysis

            </p>

            <p className="mt-2 text-sm leading-6 text-[#59685F]">

              {health.analysis}

            </p>

          </div>


          {/* WATERING */}

          <div className="rounded-2xl border border-[#DCEBE0] p-4">

            <div className="flex gap-3">

              <Droplets
                size={21}
                className="text-blue-500"
              />

              <div>

                <p className="font-semibold text-[#123C2B]">

                  Watering

                </p>

                <p className="mt-1 text-sm text-[#59685F]">

                  {health.wateringNeeded
                    ? health.suggestedWateringReason
                    : "No immediate watering required based on recent sensor data."
                  }

                </p>

              </div>

            </div>

          </div>


          {/* RECOMMENDATION */}

          <div className="rounded-2xl bg-[#EAF6ED] p-4">

            <div className="flex gap-3">

              <Brain
                size={21}
                className="text-[#49A86F]"
              />

              <div>

                <p className="font-semibold text-[#123C2B]">

                  Today's Recommendation 🌱

                </p>

                <p className="mt-2 text-sm leading-6 text-[#59685F]">

                  {health.recommendation}

                </p>

              </div>

            </div>

          </div>


          {/* PREDICTION */}

          <div className="rounded-2xl bg-[#F7FBF8] border border-[#DCEBE0] p-4">

            <p className="text-xs text-gray-400">

              Future Risk Prediction

            </p>

            <p className="mt-2 text-sm leading-6 text-[#59685F]">

              {health.prediction}

            </p>

          </div>


        </div>
      )}

    </div>
  );
}


export default DailyMonitoring;