import {
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Droplets,
  Leaf,
  Plus,
  Sparkles,
  Activity,
  Thermometer,
  Sprout,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* =====================================================
   FEATURED PLANTS
===================================================== */

const featuredPlants = [
  {
    name: "Tomato",
    type: "Vegetable",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=700&q=80",
    description:
      "Needs full sun and consistent watering.",
  },
  {
    name: "Snake Plant",
    type: "Succulent",
    image:
      "https://images.unsplash.com/photo-1593482892290-f54927ae2bb7?auto=format&fit=crop&w=700&q=80",
    description:
      "Hardy and drought-tolerant indoor plant.",
  },
  {
    name: "Basil",
    type: "Herb",
    image:
      "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=700&q=80",
    description:
      "Loves warm sun and regular watering.",
  },
  {
    name: "Aloe Vera",
    type: "Succulent",
    image:
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d106e7?auto=format&fit=crop&w=700&q=80",
    description:
      "Low water needs and soothing gel.",
  },
];

/* =====================================================
   MAIN DASHBOARD
===================================================== */

function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f3faf5]">
      <SignedOut>
        <GuestDashboard />
      </SignedOut>

      <SignedIn>
        <UserDashboard />
      </SignedIn>
    </main>
  );
}

/* =====================================================
   LOGGED-IN DASHBOARD
===================================================== */

function UserDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  return (
    <div className="min-h-screen bg-[#f3faf5]">

      {/* =================================================
          TOP CONTENT
      ================================================= */}

      <div className="px-4 sm:px-6 lg:px-8 pt-6">

        <div className="max-w-[1380px] mx-auto">

          {/* ================= WELCOME HERO ================= */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[32px]
              bg-gradient-to-r
              from-[#e4f5e9]
              via-[#ebf8ee]
              to-[#f1faf3]
              border
              border-[#d5eadb]
              px-6
              sm:px-10
              lg:px-14
              py-10
              sm:py-12
              lg:py-14
              flex
              flex-col
              lg:flex-row
              items-center
              justify-between
              gap-10
            "
          >

            {/* Decorative circle */}

            <div
              className="
                absolute
                -right-20
                -top-20
                w-64
                h-64
                rounded-full
                bg-[#cfe9d5]/50
              "
            />

            <div
              className="
                absolute
                right-[22%]
                -bottom-24
                w-48
                h-48
                rounded-full
                bg-[#d9efde]/60
              "
            />

            {/* LEFT */}

            <div className="relative z-10 max-w-[620px]">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-white/75
                  border
                  border-[#c8e3ce]
                  text-[#39734c]
                  text-[10px]
                  font-semibold
                "
              >
                <Sprout size={13} />
                SMART PLANT CARE
              </div>

              <h1
                className="
                  mt-5
                  text-[36px]
                  sm:text-[48px]
                  lg:text-[58px]
                  leading-[1.04]
                  font-bold
                  tracking-tight
                  text-[#1d5138]
                "
              >
                Welcome back,
                <br />

                <span className="text-[#318b57]">
                  {firstName} 🌱
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[560px]
                  text-[14px]
                  sm:text-[16px]
                  leading-7
                  text-[#08734f]
                "
              >
                Keep your plants healthy, hydrated and
                growing with smart monitoring, AI
                suggestions and timely care reminders.
              </p>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3 mt-7">

                <button
                  type="button"
                  onClick={() => navigate("/plants")}
                  className="
                    h-12
                    px-6
                    rounded-full
                    bg-[#318b57]
                    hover:bg-[#287849]
                    text-white
                    font-semibold
                    text-sm
                    flex
                    items-center
                    gap-2
                    transition
                    shadow-sm
                  "
                >
                  <Leaf size={17} />

                  View My Plants

                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/ai-suggestion")}
                  className="
                    h-12
                    px-6
                    rounded-full
                    bg-white
                    border
                    border-[#b9dfc5]
                    text-[#17643f]
                    font-semibold
                    text-sm
                    flex
                    items-center
                    gap-2
                    hover:bg-[#f7fcf8]
                    transition
                  "
                >
                  <Sparkles size={16} />

                  AI Suggestion
                </button>

              </div>
            </div>

            {/* RIGHT VISUAL */}

            <div
              className="
                relative
                z-10
                hidden
                md:flex
                w-full
                lg:w-[43%]
                max-w-[540px]
                justify-center
              "
            >

              <div
                className="
                  w-full
                  h-[270px]
                  sm:h-[330px]
                  rounded-[32px]
                  overflow-hidden
                  bg-white
                  border
                  border-white
                  shadow-[0_18px_45px_rgba(30,90,50,0.10)]
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85"
                  alt="Green plant"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

            </div>

          </section>

          {/* =================================================
              QUICK STATUS
          ================================================= */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <StatusCard
              icon={<Leaf size={25} />}
              iconBg="bg-[#e3f5e8]"
              iconColor="text-[#318b57]"
              title="Plant Health"
              value="Healthy"
            />

            <StatusCard
              icon={<Droplets size={25} />}
              iconBg="bg-[#e1edff]"
              iconColor="text-[#347cf0]"
              title="Soil Moisture"
              value="62%"
            />

            <StatusCard
              icon={<Bell size={25} />}
              iconBg="bg-[#fff3c9]"
              iconColor="text-[#ef9b00]"
              title="Watering"
              value="1 reminder today"
              warning
            />

          </section>

        </div>
      </div>

      {/* =================================================
          TODAY'S CARE
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-6">

        <div className="max-w-[1380px] mx-auto">

          <div
            className="
              bg-white
              border
              border-[#dcefe2]
              rounded-[30px]
              p-5
              sm:p-7
              flex
              flex-col
              lg:flex-row
              items-start
              lg:items-center
              justify-between
              gap-6
              shadow-sm
            "
          >

            <div className="flex items-start gap-4">

              <div
                className="
                  w-12
                  h-12
                  shrink-0
                  rounded-2xl
                  bg-[#e7f5ea]
                  flex
                  items-center
                  justify-center
                  text-[#318b57]
                "
              >
                <Bell size={22} />
              </div>

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[#8d806b]
                  "
                >
                  TODAY'S REMINDER
                </p>

                <h2
                  className="
                    mt-1
                    text-[17px]
                    sm:text-[20px]
                    font-semibold
                    text-[#164a32]
                  "
                >
                  Your Tomato Plant may need watering soon.
                </h2>

                <p
                  className="
                    mt-1
                    text-[11px]
                    sm:text-[12px]
                    text-[#8a988f]
                  "
                >
                  Soil moisture is getting low. Check the
                  plant before watering.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/reminders")}
              className="
                w-full
                lg:w-auto
                h-11
                px-6
                rounded-full
                bg-[#318b57]
                hover:bg-[#287849]
                text-white
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              Check Reminders
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-6">

        <div
          className="
            max-w-[1380px]
            mx-auto
            grid
            lg:grid-cols-[1.55fr_1fr]
            gap-5
          "
        >

          {/* ================= PLANT STATUS ================= */}

          <div
            className="
              bg-white
              border
              border-[#dcefe2]
              rounded-[30px]
              p-5
              sm:p-7
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[#8d806b]
                  "
                >
                  OVERVIEW
                </p>

                <h2
                  className="
                    mt-1
                    text-[23px]
                    font-bold
                    text-[#164a32]
                  "
                >
                  Your Plant Status
                </h2>

              </div>

              <button
                type="button"
                onClick={() => navigate("/plants")}
                className="
                  text-sm
                  font-semibold
                  text-[#318b57]
                  hover:underline
                "
              >
                View all
              </button>

            </div>

            <div className="mt-5 space-y-3">

              <PlantStatus
                name="Tomato Plant"
                moisture="42%"
                health="87%"
                status="Needs Water"
                warning
              />

              <PlantStatus
                name="Money Plant"
                moisture="61%"
                health="94%"
                status="Healthy"
              />

              <PlantStatus
                name="Rose Plant"
                moisture="34%"
                health="76%"
                status="Needs Care"
                warning
              />

            </div>

            <button
              type="button"
              onClick={() => navigate("/plants")}
              className="
                mt-5
                w-full
                h-11
                rounded-full
                border
                border-[#cfe5d5]
                bg-[#f7fbf8]
                hover:bg-[#eef8f1]
                text-[#267342]
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >
              Manage My Plants
              <ArrowRight size={16} />
            </button>

          </div>

          {/* ================= TODAY CARE ================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              bg-[#1d5138]
              p-6
              sm:p-7
              text-white
            "
          >

            <div
              className="
                absolute
                -right-14
                -top-14
                w-44
                h-44
                rounded-full
                bg-[#318b57]
                opacity-30
              "
            />

            <div
              className="
                absolute
                -bottom-16
                -left-16
                w-40
                h-40
                rounded-full
                bg-[#318b57]
                opacity-20
              "
            />

            <div className="relative z-10">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Droplets
                  size={22}
                  className="text-[#9de0b2]"
                />
              </div>

              <p
                className="
                  mt-6
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#a9c9b2]
                "
              >
                TODAY'S CARE
              </p>

              <h2
                className="
                  mt-2
                  text-[23px]
                  sm:text-[26px]
                  font-bold
                "
              >
                Your plants need some love 🌿
              </h2>

              <p
                className="
                  mt-3
                  text-[12px]
                  leading-6
                  text-[#c4d8c9]
                "
              >
                Your Tomato Plant has low soil moisture.
                It may need watering today.
              </p>

              <div
                className="
                  mt-5
                  p-4
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/10
                "
              >

                <div className="flex items-center gap-3">

                  <Bell
                    size={17}
                    className="text-[#9de0b2]"
                  />

                  <span className="text-[11px]">
                    1 watering reminder today
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate("/reminders")}
                className="
                  mt-4
                  w-full
                  h-11
                  rounded-full
                  bg-white
                  hover:bg-[#f3f8f4]
                  text-[#173f29]
                  text-sm
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >
                Check Reminders
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-7">

        <div className="max-w-[1380px] mx-auto">

          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                font-semibold
                text-[#8d806b]
              "
            >
              SHORTCUTS
            </p>

            <h2
              className="
                mt-1
                text-[23px]
                font-bold
                text-[#164a32]
              "
            >
              Quick Actions
            </h2>

          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-3
              sm:gap-4
              mt-4
            "
          >

            <QuickAction
              icon={<Plus size={20} />}
              title="Add Plant"
              subtitle="Track a new plant"
              onClick={() => navigate("/plants")}
            />

            <QuickAction
              icon={<Activity size={20} />}
              title="Monitoring"
              subtitle="View plant data"
              onClick={() => navigate("/monitoring")}
            />

            <QuickAction
              icon={<Sparkles size={20} />}
              title="AI Suggestion"
              subtitle="Get plant advice"
              onClick={() => navigate("/ai-suggestion")}
            />

            <QuickAction
              icon={<Bell size={20} />}
              title="Reminders"
              subtitle="Check today's care"
              onClick={() => navigate("/reminders")}
            />

          </div>

        </div>

      </section>

      {/* =================================================
          FEATURED PLANTS
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 py-8">

        <div className="max-w-[1380px] mx-auto">

          <div
            className="
              flex
              items-end
              justify-between
              gap-4
              mb-6
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  font-semibold
                  text-[#8d806b]
                "
              >
                EXPLORE
              </p>

              <h2
                className="
                  mt-1
                  text-[24px]
                  sm:text-[28px]
                  font-bold
                  text-[#164a32]
                "
              >
                Featured Plants
              </h2>

              <p
                className="
                  text-[#8d806b]
                  text-[12px]
                  sm:text-sm
                  mt-1
                "
              >
                Plants you can monitor with EcoMinds
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/plants")}
              className="
                hidden
                sm:flex
                items-center
                gap-2
                text-[#318b57]
                font-semibold
                text-sm
              "
            >
              View All
              <ArrowRight size={16} />
            </button>

          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >

            {featuredPlants.map((plant) => (
              <div
                key={plant.name}
                className="
                  bg-white
                  rounded-[26px]
                  overflow-hidden
                  border
                  border-[#dcefe2]
                  shadow-sm
                  hover:shadow-md
                  hover:-translate-y-1
                  transition
                "
              >

                <img
                  src={plant.image}
                  alt={plant.name}
                  className="
                    w-full
                    h-[190px]
                    object-cover
                  "
                />

                <div className="p-5">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <h3
                      className="
                        text-[17px]
                        font-bold
                        text-[#164a32]
                      "
                    >
                      {plant.name}
                    </h3>

                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-[#eef8f1]
                        text-[#318b57]
                        text-[9px]
                        font-semibold
                        whitespace-nowrap
                      "
                    >
                      {plant.type}
                    </span>

                  </div>

                  <p
                    className="
                      text-[#8d806b]
                      text-[11px]
                      mt-3
                      leading-5
                    "
                  >
                    {plant.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          BOTTOM INFO
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 pb-8">

        <div
          className="
            max-w-[1380px]
            mx-auto
            rounded-[24px]
            bg-[#edf7ef]
            border
            border-[#d6e9da]
            p-4
            sm:p-5
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={20}
                className="text-[#267342]"
              />
            </div>

            <div>

              <p
                className="
                  text-[11px]
                  font-bold
                  text-[#31563d]
                "
              >
                Your plants are being monitored
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  text-[#7c8c82]
                "
              >
                Keep checking your reminders for better
                plant health.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/monitoring")}
            className="
              text-[10px]
              font-semibold
              text-[#267342]
              flex
              items-center
              gap-1
            "
          >
            Open Monitoring
            <ArrowRight size={13} />
          </button>

        </div>

      </section>

    </div>
  );
}

/* =====================================================
   STATUS CARD
===================================================== */

function StatusCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  warning = false,
}) {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-[#dcefe2]
        p-6
        sm:p-7
        flex
        items-center
        gap-4
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <div
        className={`
          w-14
          h-14
          shrink-0
          rounded-full
          ${iconBg}
          ${iconColor}
          flex
          items-center
          justify-center
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[#8b806d] text-sm">
          {title}
        </p>

        {warning ? (
          <span
            className="
              inline-flex
              mt-1
              px-3
              py-1
              rounded-full
              border
              border-red-200
              bg-red-50
              text-red-600
              text-[11px]
              font-semibold
            "
          >
            {value}
          </span>
        ) : (
          <p
            className="
              text-[19px]
              font-semibold
              text-[#123f2b]
            "
          >
            {value}
          </p>
        )}

      </div>

    </div>
  );
}

/* =====================================================
   PLANT STATUS
===================================================== */

function PlantStatus({
  name,
  moisture,
  health,
  status,
  warning = false,
}) {
  const iconClass = warning
    ? "bg-[#fff3df] text-[#e69a20]"
    : "bg-[#dff1e4] text-[#347548]";

  const statusClass = warning
    ? "bg-[#fff1dc] text-[#d98b13]"
    : "bg-[#e4f3e7] text-[#267342]";

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        p-3
        sm:p-4
        rounded-2xl
        bg-[#f8faf8]
        border
        border-[#e6eee7]
      "
    >

      <div className="flex items-center gap-3 min-w-0">

        <div
          className={`
            w-10
            h-10
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            ${iconClass}
          `}
        >
          <Leaf size={18} />
        </div>

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              sm:text-[12px]
              font-semibold
              text-[#294b35]
              truncate
            "
          >
            {name}
          </p>

          <p
            className="
              mt-1
              text-[9px]
              text-[#829087]
            "
          >
            Moisture {moisture} · Health {health}
          </p>

        </div>

      </div>

      <span
        className={`
          shrink-0
          px-2.5
          py-1
          rounded-full
          text-[8px]
          font-semibold
          ${statusClass}
        `}
      >
        {status}
      </span>

    </div>
  );
}

/* =====================================================
   QUICK ACTION
===================================================== */

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        bg-white
        border
        border-[#dce8de]
        hover:border-[#b4d0ba]
        hover:bg-[#f8fbf8]
        hover:-translate-y-0.5
        rounded-2xl
        p-4
        flex
        items-center
        gap-3
        text-left
        transition
      "
    >

      <span
        className="
          w-10
          h-10
          shrink-0
          rounded-xl
          bg-[#e6f2e8]
          flex
          items-center
          justify-center
          text-[#267342]
        "
      >
        {icon}
      </span>

      <span className="min-w-0">

        <span
          className="
            block
            text-[10px]
            font-semibold
            text-[#31563d]
          "
        >
          {title}
        </span>

        <span
          className="
            block
            mt-1
            text-[8px]
            text-[#8b988f]
          "
        >
          {subtitle}
        </span>

      </span>

    </button>
  );
}

/* =====================================================
   LOGGED-OUT / GUEST DASHBOARD
===================================================== */

function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3faf5]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">

        <div
          className="
            max-w-[1380px]
            mx-auto
            rounded-[34px]
            bg-gradient-to-r
            from-[#8bba97]
            to-[#effaf2]
            px-6
            sm:px-10
            lg:px-14
            py-10
            sm:py-14
            lg:py-16
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-10
          "
        >

          {/* LEFT */}

          <div className="max-w-[590px]">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-white/75
                border
                border-[#c9e1cf]
                text-[#39734c]
                text-[10px]
                font-semibold
              "
            >
              <Sprout size={13} />
              SMART PLANT CARE
            </div>

            <h1
              className="
                mt-5
                text-[40px]
                sm:text-[52px]
                lg:text-[62px]
                font-bold
                leading-[1.03]
                text-[#1d5138]
              "
            >
              Grow Smarter with
              <br />
              EcoMinds
            </h1>

            <p
              className="
                mt-5
                text-[16px]
                sm:text-[18px]
                lg:text-[20px]
                leading-8
                text-[#08734f]
              "
            >
              Smart plant care powered by soil moisture
              monitoring and AI suggestions.
            </p>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3 mt-8">

              <button
                type="button"
                onClick={() => navigate("/plants")}
                className="
                  bg-[#318b57]
                  hover:bg-[#287849]
                  text-white
                  px-7
                  py-3.5
                  rounded-full
                  font-semibold
                  text-sm
                  sm:text-base
                  flex
                  items-center
                  gap-2
                  transition
                  shadow-sm
                "
              >
                Add Your Plant
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/ai-suggestion")}
                className="
                  bg-white
                  border
                  border-[#a9dfbd]
                  text-[#17643f]
                  px-7
                  py-3.5
                  rounded-full
                  font-semibold
                  text-sm
                  sm:text-base
                  flex
                  items-center
                  gap-2
                  hover:bg-[#f4fbf6]
                  transition
                "
              >
                <Sparkles size={17} />
                Check Plant Health
              </button>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div
            className="
              w-full
              lg:w-[48%]
              max-w-[570px]
            "
          >

            <img
              src="https://media.istockphoto.com/id/2159309108/photo/people-hands-and-growth-of-plants-nature-and-earth-day-for-leaves-sustainability-and-support.jpg?s=612x612&w=0&k=20&c=1x3H2j9zWt0MtDh0PvP2NkzoF13huFTKJvn77n6zyMY="
              alt="Plant growing in hand"
              className="
                w-full
                h-[270px]
                sm:h-[340px]
                lg:h-[400px]
                object-cover
                rounded-[34px]
                shadow-[0_18px_45px_rgba(30,90,50,0.10)]
              "
            />

          </div>

        </div>

      </section>

      {/* =================================================
          DEMO NOTICE
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-6">

        <div
          className="
            max-w-[1380px]
            mx-auto
            border
            border-[#f4ca55]
            bg-[#fffbea]
            rounded-[22px]
            sm:rounded-full
            px-5
            sm:px-7
            py-4
            flex
            items-start
            sm:items-center
            gap-3
            text-[#bd5b00]
          "
        >

          <Bell
            size={20}
            className="shrink-0 mt-0.5 sm:mt-0"
          />

          <p className="text-[12px] sm:text-sm">

            You're exploring in demo mode with sample
            plants.

            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="font-semibold underline ml-1"
            >
              Sign in
            </button>

            {" "}to add and save your own plants.

          </p>

        </div>

      </section>

      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-6">

        <div
          className="
            max-w-[1380px]
            mx-auto
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          <StatusCard
            icon={<Leaf size={25} />}
            iconBg="bg-[#e3f5e8]"
            iconColor="text-[#318b57]"
            title="Plant Health"
            value="Healthy"
          />

          <StatusCard
            icon={<Droplets size={25} />}
            iconBg="bg-[#e1edff]"
            iconColor="text-[#347cf0]"
            title="Soil Moisture"
            value="31%"
          />

          <StatusCard
            icon={<Bell size={25} />}
            iconBg="bg-[#fff3c9]"
            iconColor="text-[#ef9b00]"
            title="Watering"
            value="Missed Watering"
            warning
          />

        </div>

      </section>

      {/* =================================================
          TODAY'S REMINDER
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 mt-6">

        <div
          className="
            max-w-[1380px]
            mx-auto
            bg-white
            rounded-[30px]
            border
            border-[#dcefe2]
            p-5
            sm:p-7
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-5
            shadow-sm
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-2xl
                bg-[#fff3c9]
                flex
                items-center
                justify-center
                text-[#ef9b00]
              "
            >
              <Bell size={22} />
            </div>

            <div>

              <p
                className="
                  uppercase
                  text-[10px]
                  tracking-[0.15em]
                  font-semibold
                  text-[#8d806b]
                "
              >
                Today's Reminder
              </p>

              <p
                className="
                  text-[16px]
                  sm:text-[18px]
                  text-[#164a32]
                  mt-1
                  font-medium
                "
              >
                Your Tomato plant may need watering soon.
              </p>

              <p
                className="
                  text-[11px]
                  text-[#8d988f]
                  mt-1
                "
              >
                Check your plant moisture before watering.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/plants")}
            className="
              w-full
              md:w-auto
              bg-[#318b57]
              hover:bg-[#287849]
              text-white
              px-7
              py-3.5
              rounded-full
              font-semibold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            View Plant
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

      {/* =================================================
          FEATURED PLANTS
      ================================================= */}

      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        <div className="max-w-[1380px] mx-auto">

          <div
            className="
              flex
              items-end
              justify-between
              gap-4
              mb-6
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  font-semibold
                  text-[#8d806b]
                "
              >
                EXPLORE PLANTS
              </p>

              <h2
                className="
                  text-[27px]
                  sm:text-[34px]
                  font-bold
                  text-[#164a32]
                  mt-1
                "
              >
                Featured Plants
              </h2>

              <p
                className="
                  text-[#8d806b]
                  text-[12px]
                  sm:text-sm
                  mt-1
                "
              >
                Get to know the plants you can monitor
                with EcoMinds.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/plants")}
              className="
                hidden
                md:flex
                items-center
                gap-2
                text-[#147143]
                font-semibold
                text-sm
              "
            >
              View All
              <ArrowRight size={17} />
            </button>

          </div>

          {/* PLANT CARDS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
            "
          >

            {featuredPlants.map((plant) => (

              <div
                key={plant.name}
                className="
                  bg-white
                  rounded-[28px]
                  overflow-hidden
                  border
                  border-[#dcefe2]
                  shadow-sm
                  hover:shadow-md
                  hover:-translate-y-1
                  transition
                "
              >

                <img
                  src={plant.image}
                  alt={plant.name}
                  className="
                    w-full
                    h-[210px]
                    object-cover
                  "
                />

                <div className="p-5">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <h3
                      className="
                        text-[18px]
                        font-semibold
                        text-[#164a32]
                      "
                    >
                      {plant.name}
                    </h3>

                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-[#eef8f1]
                        text-[#318b57]
                        text-[9px]
                        font-semibold
                      "
                    >
                      {plant.type}
                    </span>

                  </div>

                  <p
                    className="
                      text-[#8d806b]
                      text-[11px]
                      mt-3
                      leading-5
                    "
                  >
                    {plant.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        className="
          bg-white
          border-t
          border-[#dcefe2]
          py-8
          text-center
        "
      >

        <p
          className="
            text-[#8d806b]
            text-[12px]
            sm:text-sm
          "
        >
          🌱 EcoMinds — Smart plant care for a greener tomorrow
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;