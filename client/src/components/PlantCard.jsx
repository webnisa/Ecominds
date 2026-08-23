import { useNavigate } from "react-router-dom";
import {
  Trash2,
  MapPin,
  Droplets,
  Leaf,
  Thermometer,
  FlaskConical,
  HeartPulse,
  Clock3,
} from "lucide-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function PlantCard({ plant, onDelete }) {
  const navigate = useNavigate();

  if (!plant) return null;

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = () => {
    if (!plant.image) return null;

    if (
      plant.image.startsWith("http://") ||
      plant.image.startsWith("https://")
    ) {
      return plant.image;
    }

    return `${BACKEND_URL}${
      plant.image.startsWith("/") ? "" : "/"
    }${plant.image}`;
  };

  const imageUrl = getImageUrl();

  // ==========================================
  // DATA
  // ==========================================

  const moisture = Number(
    plant.moisture ??
      plant.soilMoisture ??
      plant.latestData?.moisture ??
      plant.latestData?.soilMoisture ??
      55
  );

  const temperature = Number(
    plant.temperature ??
      plant.temp ??
      plant.latestData?.temperature ??
      24
  );

  const nutrients = Number(
    plant.nutrients ??
      plant.latestData?.nutrients ??
      70
  );

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (e) => {
    e.stopPropagation();

    if (onDelete) {
      onDelete(plant._id);
    }
  };

  // ==========================================
  // PIE / DONUT CHART
  // ==========================================

  const chartSize = 150;
  const center = 75;
  const radius = 52;

  const circumference = 2 * Math.PI * radius;

  // Equal 3 sections
  const section = circumference / 3;

  // Small gap between sections
  const gap = 7;

  // ==========================================
  // LAST WATERED
  // ==========================================

  const getLastWatered = () => {
    if (plant.lastWatered) {
      const date = new Date(plant.lastWatered);

      if (!isNaN(date.getTime())) {
        const now = new Date();

        const difference =
          now.getTime() - date.getTime();

        const days = Math.floor(
          difference / (1000 * 60 * 60 * 24)
        );

        if (days <= 0) {
          return "Today";
        }

        if (days === 1) {
          return "1 day ago";
        }

        return `${days} days ago`;
      }
    }

    return "3 days ago";
  };

  // ==========================================
  // CARD
  // ==========================================

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-[28px]
        bg-white
        border
        border-[#DCEBE0]
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ======================================
          PLANT IMAGE
      ====================================== */}

      <div className="relative h-[220px] w-full overflow-hidden bg-[#EAF5EC]">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={plant.plantName || "Plant"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            onError={(e) => {
              console.error(
                "Plant image failed:",
                imageUrl
              );

              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="
            flex
            h-full
            w-full
            items-center
            justify-center
            text-7xl
          ">
            🌱
          </div>
        )}

        {/* Image dark gradient */}

        <div className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/40
          via-transparent
          to-transparent
        " />

        {/* Delete */}

        <button
          type="button"
          onClick={handleDelete}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-red-500
            shadow-md
            backdrop-blur
            transition
            hover:bg-red-50
          "
          title="Delete plant"
        >
          <Trash2 size={18} />
        </button>

      </div>

      {/* ======================================
          PLANT NAME
      ====================================== */}

      <div className="px-6 pt-5">

        <div className="flex items-center gap-2">

          <Leaf
            size={19}
            className="text-[#49A86F]"
          />

          <h2 className="
            truncate
            text-xl
            font-bold
            text-[#123C2B]
          ">
            {plant.plantName || "Unnamed Plant"}
          </h2>

        </div>

        {plant.plantType && (
          <p className="
            ml-7
            mt-1
            text-sm
            text-[#817D75]
          ">
            {plant.plantType}
          </p>
        )}

        {plant.location && (
          <div className="
            mt-3
            flex
            items-center
            gap-2
            text-sm
            text-[#817D75]
          ">
            <MapPin
              size={15}
              className="text-[#49A86F]"
            />

            <span>{plant.location}</span>
          </div>
        )}

      </div>

      {/* ======================================
          SENSOR BOXES
      ====================================== */}

      <div className="
        grid
        grid-cols-3
        gap-2
        px-6
        pt-5
      ">

        {/* MOISTURE */}

        <div className="
          rounded-2xl
          bg-[#EEF6FF]
          px-2
          py-3
          text-center
        ">

          <Droplets
            size={20}
            className="mx-auto text-[#3F7FF0]"
          />

          <p className="
            mt-1
            text-[22px]
            font-bold
            text-[#123C2B]
          ">
            {moisture}%
          </p>

          <p className="
            text-sm
            text-[#817D75]
          ">
            Moisture
          </p>

        </div>

        {/* TEMPERATURE */}

        <div className="
          rounded-2xl
          bg-[#FFF8E8]
          px-2
          py-3
          text-center
        ">

          <Thermometer
            size={20}
            className="mx-auto text-[#F39A0A]"
          />

          <p className="
            mt-1
            text-[22px]
            font-bold
            text-[#123C2B]
          ">
            {temperature}°C
          </p>

          <p className="
            text-sm
            text-[#817D75]
          ">
            Temp
          </p>

        </div>

        {/* NUTRIENTS */}

        <div className="
          rounded-2xl
          bg-[#EEF6FF]
          px-2
          py-3
          text-center
        ">

          <FlaskConical
            size={20}
            className="mx-auto text-[#3F7FF0]"
          />

          <p className="
            mt-1
            text-[22px]
            font-bold
            text-[#123C2B]
          ">
            {nutrients}%
          </p>

          <p className="
            text-sm
            text-[#817D75]
          ">
            Nutrients
          </p>

        </div>

      </div>

      {/* ======================================
          DONUT CHART
      ====================================== */}

      <div className="
        mx-6
        mt-5
        rounded-[26px]
        bg-[#F8FBF8]
        px-4
        py-5
      ">

        <div className="
          flex
          items-center
          justify-center
          gap-4
        ">

          {/* CHART */}

          <div className="
            relative
            shrink-0
          ">

            <svg
              width={chartSize}
              height={chartSize}
              viewBox="0 0 150 150"
              className="-rotate-90"
            >

              {/* ==================================
                  GREEN - MOISTURE
              ================================== */}

              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#49A86F"
                strokeWidth="27"
                strokeDasharray={`
                  ${section - gap}
                  ${circumference - section + gap}
                `}
                strokeDashoffset="0"
              />

              {/* ==================================
                  ORANGE - TEMPERATURE
              ================================== */}

              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#F5A00B"
                strokeWidth="27"
                strokeDasharray={`
                  ${section - gap}
                  ${circumference - section + gap}
                `}
                strokeDashoffset={-section}
              />

              {/* ==================================
                  BLUE - NUTRIENTS
              ================================== */}

              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#3F7FF0"
                strokeWidth="27"
                strokeDasharray={`
                  ${section - gap}
                  ${circumference - section + gap}
                `}
                strokeDashoffset={-(section * 2)}
              />

            </svg>

            {/* WHITE CENTER */}

            <div className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[61px]
              w-[61px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#F8FBF8]
            " />

          </div>

          {/* ==================================
              LEGEND
          ================================== */}

          <div className="
            flex
            min-w-0
            flex-col
            gap-3
          ">

            {/* Moisture */}

            <div className="
              flex
              items-center
              gap-2
              text-sm
            ">

              <span className="
                h-3.5
                w-3.5
                shrink-0
                rounded-full
                bg-[#49A86F]
              " />

              <span className="text-[#817D75]">
                Moisture
              </span>

              <strong className="
                ml-auto
                text-[#123C2B]
              ">
                {moisture}%
              </strong>

            </div>

            {/* Temperature */}

            <div className="
              flex
              items-center
              gap-2
              text-sm
            ">

              <span className="
                h-3.5
                w-3.5
                shrink-0
                rounded-full
                bg-[#F5A00B]
              " />

              <span className="text-[#817D75]">
                Temperature
              </span>

              <strong className="
                ml-auto
                text-[#123C2B]
              ">
                {temperature}°C
              </strong>

            </div>

            {/* Nutrients */}

            <div className="
              flex
              items-center
              gap-2
              text-sm
            ">

              <span className="
                h-3.5
                w-3.5
                shrink-0
                rounded-full
                bg-[#3F7FF0]
              " />

              <span className="text-[#817D75]">
                Nutrients
              </span>

              <strong className="
                ml-auto
                text-[#123C2B]
              ">
                {nutrients}%
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          DIVIDER
      ====================================== */}

      <div className="mx-6 mt-5 border-t border-[#EDF1EE]" />

      {/* ======================================
          HEALTH
      ====================================== */}

      <div className="px-6 pt-5">

        {/* Health */}

        <div className="
          flex
          items-center
          justify-between
          gap-3
        ">

          <div className="
            flex
            items-center
            gap-2
            text-[#817D75]
          ">

            <HeartPulse
              size={18}
              className="text-[#9A927F]"
            />

            <span>Health</span>

          </div>

          <span className="
            font-semibold
            text-[#087443]
          ">
            Healthy
          </span>

        </div>

        {/* Last watered */}

        <div className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
        ">

          <div className="
            flex
            items-center
            gap-2
            text-[#817D75]
          ">

            <Clock3
              size={18}
              className="text-[#9A927F]"
            />

            <span>Last watered</span>

          </div>

          <span className="
            font-semibold
            text-[#123C2B]
          ">
            {getLastWatered()}
          </span>

        </div>

        {/* Watering */}

        <div className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
        ">

          <div className="
            flex
            items-center
            gap-2
            text-[#817D75]
          ">

            <Droplets
              size={18}
              className="text-[#9A927F]"
            />

            <span>Watering</span>

          </div>

          <span className="
            font-semibold
            text-[#087443]
          ">
            Healthy
          </span>

        </div>

      </div>

      {/* ======================================
          VIEW DETAILS
      ====================================== */}

      <div className="px-6 pb-6 pt-6">

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/plants/${plant._id}`);
          }}
          className="
            w-full
            rounded-full
            bg-[#F0F8F2]
            py-3.5
            text-base
            font-semibold
            text-[#087443]
            transition
            hover:bg-[#E2F2E6]
          "
        >
          View Details
        </button>

      </div>

    </div>
  );
}

export default PlantCard;