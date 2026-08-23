import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  Thermometer,
  FlaskConical,
  Sprout,
  Activity,
  CalendarDays,
  Power,
  RefreshCw,
  BrainCircuit,
  Clock3,
} from "lucide-react";

function PlantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeGraph, setActiveGraph] = useState("moisture");
  const [pumpStatus, setPumpStatus] = useState(false);
  const [watering, setWatering] = useState(false);

  // =====================================================
  // DEMO DATA ONLY
  // Backend abhi connect nahi hai
  // =====================================================

  useEffect(() => {
    const demoPlant = {
      _id: id || "demo-plant",
      name: "Tomato Plant",
      type: "Vegetable",
      location: "Balcony",

      image: "",

      healthScore: 87,
      health: "Excellent",

      moisture: 42,
      temperature: 28,
      humidity: 64,
      nutrients: 68,

      light: "Good",

      lastWatered: "Today, 9:30 AM",

      aiInsight:
        "Your plant is doing well. Soil moisture is currently at a healthy level. Keep monitoring it regularly.",
    };

    const demoHistory = [
      {
        date: "Mon",
        moisture: 56,
        temperature: 26,
        humidity: 61,
      },
      {
        date: "Tue",
        moisture: 49,
        temperature: 27,
        humidity: 63,
      },
      {
        date: "Wed",
        moisture: 45,
        temperature: 28,
        humidity: 65,
      },
      {
        date: "Thu",
        moisture: 38,
        temperature: 29,
        humidity: 67,
      },
      {
        date: "Fri",
        moisture: 42,
        temperature: 28,
        humidity: 64,
      },
    ];

    setPlant(demoPlant);
    setHistory(demoHistory);
  }, [id]);

  // =====================================================
  // MANUAL WATERING
  // =====================================================

  const handleWaterPlant = () => {
    setWatering(true);

    setTimeout(() => {
      setPlant((previous) => ({
        ...previous,
        moisture: Math.min(
          Number(previous.moisture) + 20,
          100
        ),
        lastWatered: "Just now",
      }));

      setWatering(false);
    }, 700);
  };

  // =====================================================
  // PUMP
  // =====================================================

  const handlePump = (status) => {
    setPumpStatus(status);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    window.location.reload();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!plant) {
    return (
      <div className="min-h-screen bg-[#f5f9f5] flex items-center justify-center">
        <div className="text-center">

          <Sprout
            size={45}
            className="mx-auto text-[#166534]"
          />

          <p className="mt-3 text-sm text-[#718078]">
            Loading plant...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const moisture = Number(plant.moisture);
  const temperature = Number(plant.temperature);
  const humidity = Number(plant.humidity);
  const nutrients = Number(plant.nutrients);
  const healthScore = Number(plant.healthScore);

  // =====================================================
  // GRAPH VALUE
  // =====================================================

  const getGraphValue = (item) => {
    if (activeGraph === "temperature") {
      return Number(item.temperature);
    }

    if (activeGraph === "humidity") {
      return Number(item.humidity);
    }

    return Number(item.moisture);
  };

  return (
    <main className="min-h-screen bg-[#f5f9f5]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 pt-6">

        <div className="max-w-[1400px] mx-auto">

          {/* BACK */}

          <button
            onClick={() => navigate("/plants")}
            className="
              flex
              items-center
              gap-2
              text-[13px]
              font-semibold
              text-[#5d7665]
              hover:text-[#14532d]
              transition
            "
          >
            <ArrowLeft size={17} />

            My Plants
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

              <div className="flex flex-wrap items-center gap-3">

                <h1
                  className="
                    text-[28px]
                    sm:text-[34px]
                    font-bold
                    text-[#123d26]
                  "
                >
                  {plant.name}
                </h1>


                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-[#e4f3e7]
                    text-[#267342]
                    text-[10px]
                    font-semibold
                  "
                >
                  ● {plant.health}
                </span>

              </div>


              <p
                className="
                  mt-1
                  text-[12px]
                  text-[#718078]
                "
              >
                {plant.type} • {plant.location}
              </p>

            </div>


            {/* REFRESH */}

            <button
              onClick={handleRefresh}
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
                transition
              "
            >
              <RefreshCw size={15} />

              Refresh
            </button>

          </div>

        </div>

      </section>


      {/* ==================================================
          HERO
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 mt-6">

        <div
          className="
            max-w-[1400px]
            mx-auto
            grid
            lg:grid-cols-3
            gap-5
          "
        >

          {/* ==================================================
              PLANT IMAGE
          ================================================== */}

          <div
            className="
              lg:col-span-2
              min-h-[280px]
              rounded-[26px]
              overflow-hidden
              relative
              bg-gradient-to-br
              from-[#e4f2e6]
              to-[#c9e3ce]
            "
          >

            {plant.image ? (

              <img
                src={plant.image}
                alt={plant.name}
                className="
                  w-full
                  h-full
                  min-h-[280px]
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  min-h-[280px]
                  w-full
                  flex
                  items-center
                  justify-center
                "
              >

                <Sprout
                  size={110}
                  strokeWidth={1}
                  className="text-[#4d8b5c]"
                />

              </div>

            )}


            {/* IMAGE LABEL */}

            <div
              className="
                absolute
                left-5
                right-5
                bottom-5
                p-4
                rounded-2xl
                bg-white/90
                backdrop-blur
              "
            >

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-[#718078]
                "
              >
                Your Plant
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-[#163d27]
                "
              >
                {plant.name}
              </p>

            </div>

          </div>


          {/* ==================================================
              HEALTH
          ================================================== */}

          <div
            className="
              bg-white
              rounded-[26px]
              border
              border-[#d9e7dc]
              p-6
              flex
              flex-col
              justify-between
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[12px]
                    text-[#718078]
                  "
                >
                  Plant Health
                </p>

                <h2
                  className="
                    mt-1
                    text-[20px]
                    font-bold
                    text-[#163d27]
                  "
                >
                  {plant.health}
                </h2>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-[#e5f3e8]
                  flex
                  items-center
                  justify-center
                "
              >

                <Activity
                  size={22}
                  className="text-[#267342]"
                />

              </div>

            </div>


            {/* HEALTH CIRCLE */}

            <div
              className="
                flex
                items-center
                justify-center
                py-7
              "
            >

              <div
                className="
                  w-40
                  h-40
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
                style={{
                  background: `conic-gradient(
                    #166534 ${healthScore * 3.6}deg,
                    #e5eee7 ${healthScore * 3.6}deg
                  )`,
                }}
              >

                <div
                  className="
                    w-[126px]
                    h-[126px]
                    rounded-full
                    bg-white
                    flex
                    flex-col
                    items-center
                    justify-center
                  "
                >

                  <span
                    className="
                      text-[34px]
                      font-bold
                      text-[#14532d]
                    "
                  >
                    {healthScore}%
                  </span>

                  <span
                    className="
                      text-[10px]
                      text-[#7b877f]
                    "
                  >
                    Health Score
                  </span>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                bg-[#f1f8f2]
                p-3
                text-center
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#5f7767]
                "
              >
                🌱 Your plant is currently in good condition.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CURRENT CONDITIONS
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 mt-6">

        <div className="max-w-[1400px] mx-auto">

          <div className="mb-4">

            <h2
              className="
                text-[21px]
                font-bold
                text-[#163d27]
              "
            >
              Current Conditions
            </h2>

            <p
              className="
                mt-1
                text-[12px]
                text-[#7b877f]
              "
            >
              Current information about your plant
            </p>

          </div>


          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >

            <ConditionCard
              icon={<Droplets size={21} />}
              title="Soil Moisture"
              value={`${moisture}%`}
              status={
                moisture < 30
                  ? "Very Dry"
                  : moisture < 45
                  ? "Needs Water"
                  : "Good"
              }
              iconClass="bg-[#e8f2ff] text-[#2878df]"
            />


            <ConditionCard
              icon={<Thermometer size={21} />}
              title="Temperature"
              value={`${temperature}°C`}
              status="Normal"
              iconClass="bg-[#fff2df] text-[#df8b00]"
            />


            <ConditionCard
              icon={<Activity size={21} />}
              title="Humidity"
              value={`${humidity}%`}
              status="Good"
              iconClass="bg-[#eeeaff] text-[#6753c9]"
            />


            <ConditionCard
              icon={<FlaskConical size={21} />}
              title="Nutrients"
              value={`${nutrients}%`}
              status="Healthy"
              iconClass="bg-[#e7f5e9] text-[#267342]"
            />

          </div>

        </div>

      </section>


      {/* ==================================================
          GRAPH + WATERING
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 mt-6">

        <div
          className="
            max-w-[1400px]
            mx-auto
            grid
            lg:grid-cols-3
            gap-5
          "
        >

          {/* ==================================================
              GRAPH
          ================================================== */}

          <div
            className="
              lg:col-span-2
              bg-white
              border
              border-[#d9e7dc]
              rounded-[26px]
              p-5
              sm:p-6
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >

              <div>

                <h2
                  className="
                    text-[19px]
                    font-bold
                    text-[#163d27]
                  "
                >
                  Sensor History
                </h2>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-[#7b877f]
                  "
                >
                  Monitor your plant over the last few days
                </p>

              </div>


              {/* GRAPH TABS */}

              <div
                className="
                  flex
                  gap-1
                  bg-[#f1f6f2]
                  p-1
                  rounded-lg
                "
              >

                <GraphButton
                  active={activeGraph === "moisture"}
                  onClick={() => setActiveGraph("moisture")}
                >
                  Moisture
                </GraphButton>

                <GraphButton
                  active={activeGraph === "temperature"}
                  onClick={() => setActiveGraph("temperature")}
                >
                  Temperature
                </GraphButton>

                <GraphButton
                  active={activeGraph === "humidity"}
                  onClick={() => setActiveGraph("humidity")}
                >
                  Humidity
                </GraphButton>

              </div>

            </div>


            {/* GRAPH */}

            <div
              className="
                mt-7
                h-[230px]
                flex
                items-end
                gap-2
                sm:gap-4
                px-2
              "
            >

              {history.map((item, index) => {

                const value = getGraphValue(item);

                const height =
                  activeGraph === "temperature"
                    ? Math.max(value * 5, 20)
                    : Math.max(value * 1.7, 10);

                return (
                  <div
                    key={index}
                    className="
                      flex-1
                      h-full
                      flex
                      flex-col
                      justify-end
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className="
                        text-[9px]
                        font-semibold
                        text-[#527060]
                      "
                    >
                      {value}
                    </span>


                    <div
                      className="
                        w-full
                        max-w-[42px]
                        rounded-t-xl
                        bg-[#65a873]
                        transition-all
                      "
                      style={{
                        height: `${Math.min(
                          height,
                          180
                        )}px`,
                      }}
                    />


                    <span
                      className="
                        text-[9px]
                        text-[#89948d]
                      "
                    >
                      {item.date}
                    </span>

                  </div>
                );

              })}

            </div>

          </div>


          {/* ==================================================
              WATERING
          ================================================== */}

          <div
            className="
              bg-white
              border
              border-[#d9e7dc]
              rounded-[26px]
              p-6
            "
          >

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
                  bg-[#e5f3e8]
                  flex
                  items-center
                  justify-center
                "
              >

                <Droplets
                  size={21}
                  className="text-[#267342]"
                />

              </div>


              <div>

                <h2
                  className="
                    text-[18px]
                    font-bold
                    text-[#163d27]
                  "
                >
                  Watering
                </h2>

                <p
                  className="
                    text-[10px]
                    text-[#7b877f]
                  "
                >
                  Keep your plant hydrated
                </p>

              </div>

            </div>


            {/* LAST WATERED */}

            <div
              className="
                mt-6
                rounded-xl
                bg-[#f5f9f5]
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Clock3
                  size={18}
                  className="text-[#60846a]"
                />

                <div>

                  <p
                    className="
                      text-[10px]
                      text-[#829088]
                    "
                  >
                    Last watered
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[13px]
                      font-semibold
                      text-[#163d27]
                    "
                  >
                    {plant.lastWatered}
                  </p>

                </div>

              </div>

            </div>


            {/* MANUAL WATER */}

            <button
              onClick={handleWaterPlant}
              disabled={watering}
              className="
                mt-4
                w-full
                h-11
                rounded-xl
                bg-[#166534]
                hover:bg-[#14532d]
                disabled:opacity-60
                text-white
                text-[12px]
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >

              <Droplets size={16} />

              {watering
                ? "Watering..."
                : "Water Manually"}

            </button>


            {/* AUTOMATIC PUMP */}

            <div
              className="
                mt-5
                border
                border-[#dce9df]
                rounded-2xl
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-[#edf6ef]
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <Power
                      size={17}
                      className="text-[#267342]"
                    />

                  </div>


                  <div>

                    <p
                      className="
                        text-[12px]
                        font-semibold
                        text-[#163d27]
                      "
                    >
                      Automatic Pump
                    </p>

                    <p
                      className="
                        text-[9px]
                        text-[#849087]
                      "
                    >
                      Smart watering
                    </p>

                  </div>

                </div>


                <span
                  className={`
                    text-[9px]
                    font-semibold
                    px-2
                    py-1
                    rounded-full
                    ${
                      pumpStatus
                        ? "bg-[#dff2e3] text-[#267342]"
                        : "bg-[#f0f3f1] text-[#7a857e]"
                    }
                  `}
                >
                  {pumpStatus ? "ON" : "OFF"}
                </span>

              </div>


              {/* YES / NO */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  mt-4
                "
              >

                <button
                  onClick={() => handlePump(true)}
                  className={`
                    h-9
                    rounded-lg
                    text-[10px]
                    font-semibold
                    border
                    transition
                    ${
                      pumpStatus
                        ? "bg-[#166534] text-white border-[#166534]"
                        : "bg-white text-[#166534] border-[#bfd5c4]"
                    }
                  `}
                >
                  YES
                </button>


                <button
                  onClick={() => handlePump(false)}
                  className={`
                    h-9
                    rounded-lg
                    text-[10px]
                    font-semibold
                    border
                    transition
                    ${
                      !pumpStatus
                        ? "bg-[#f3f6f3] text-[#526c5a] border-[#d5e2d8]"
                        : "bg-white text-[#627269] border-[#d5e2d8]"
                    }
                  `}
                >
                  NO
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          AI INSIGHT
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 mt-6">

        <div
          className="
            max-w-[1400px]
            mx-auto
            bg-gradient-to-r
            from-[#eaf6ec]
            to-[#f5faf5]
            border
            border-[#cfe3d3]
            rounded-[26px]
            p-5
            sm:p-6
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                w-11
                h-11
                shrink-0
                rounded-xl
                bg-[#d8ebdc]
                flex
                items-center
                justify-center
              "
            >

              <BrainCircuit
                size={22}
                className="text-[#267342]"
              />

            </div>


            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  font-semibold
                  text-[#62806b]
                "
              >
                AI Insight
              </p>

              <h2
                className="
                  mt-1
                  text-[17px]
                  font-bold
                  text-[#163d27]
                "
              >
                Smart recommendation for your plant
              </h2>

              <p
                className="
                  mt-2
                  max-w-[900px]
                  text-[12px]
                  leading-6
                  text-[#617266]
                "
              >
                {plant.aiInsight}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          RECENT CARE
      ================================================== */}

      <section className="px-4 sm:px-6 md:px-8 py-6">

        <div className="max-w-[1400px] mx-auto">

          <div
            className="
              bg-white
              border
              border-[#d9e7dc]
              rounded-[26px]
              p-5
              sm:p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <CalendarDays
                size={20}
                className="text-[#527b5d]"
              />

              <div>

                <h2
                  className="
                    text-[18px]
                    font-bold
                    text-[#163d27]
                  "
                >
                  Recent Care Activity
                </h2>

                <p
                  className="
                    text-[10px]
                    text-[#7b877f]
                  "
                >
                  Your plant care history
                </p>

              </div>

            </div>


            <div
              className="
                mt-5
                grid
                sm:grid-cols-3
                gap-3
              "
            >

              <CareActivity
                icon={<Droplets size={17} />}
                title="Watering"
                text={plant.lastWatered}
              />


              <CareActivity
                icon={<Activity size={17} />}
                title="Health Check"
                text={`${healthScore}% health score`}
              />


              <CareActivity
                icon={<Power size={17} />}
                title="Pump"
                text={
                  pumpStatus
                    ? "Currently ON"
                    : "Currently OFF"
                }
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

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


// ========================================================
// CONDITION CARD
// ========================================================

function ConditionCard({
  icon,
  title,
  value,
  status,
  iconClass,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-[#d9e7dc]
        rounded-[20px]
        p-4
        sm:p-5
        flex
        items-center
        gap-3
      "
    >

      <div
        className={`
          w-11
          h-11
          shrink-0
          rounded-xl
          flex
          items-center
          justify-center
          ${iconClass}
        `}
      >
        {icon}
      </div>


      <div className="min-w-0">

        <p
          className="
            text-[10px]
            text-[#7b877f]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[18px]
            font-bold
            text-[#163d27]
          "
        >
          {value}
        </p>

        <p
          className="
            text-[9px]
            text-[#5d7865]
          "
        >
          {status}
        </p>

      </div>

    </div>
  );
}


// ========================================================
// GRAPH BUTTON
// ========================================================

function GraphButton({
  children,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3
        py-1.5
        rounded-md
        text-[10px]
        font-semibold
        transition
        ${
          active
            ? "bg-white text-[#166534] shadow-sm"
            : "text-[#7b877f] hover:text-[#166534]"
        }
      `}
    >
      {children}
    </button>
  );
}


// ========================================================
// CARE ACTIVITY
// ========================================================

function CareActivity({
  icon,
  title,
  text,
}) {
  return (
    <div
      className="
        rounded-xl
        bg-[#f5f9f5]
        p-4
        flex
        items-center
        gap-3
      "
    >

      <div
        className="
          w-9
          h-9
          rounded-lg
          bg-[#e2f0e5]
          text-[#267342]
          flex
          items-center
          justify-center
        "
      >
        {icon}
      </div>


      <div>

        <p
          className="
            text-[10px]
            text-[#829088]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[12px]
            font-semibold
            text-[#365843]
          "
        >
          {text}
        </p>

      </div>

    </div>
  );
}


export default PlantDetails;