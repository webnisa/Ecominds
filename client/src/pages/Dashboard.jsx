import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import {
  Droplets,
  Thermometer,
  CloudSun,
  Leaf,
  ArrowRight,
  Plus,
  Bell,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f5f9f5]">

      {/* ================= LOGGED OUT ================= */}

      <SignedOut>
        <GuestDashboard />
      </SignedOut>


      {/* ================= LOGGED IN ================= */}

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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7">

      {/* ================= WELCOME ================= */}

      <section
        className="
          rounded-[28px]
          bg-[#dcefe2]
          border
          border-[#c9e1cf]
          px-5
          sm:px-8
          py-7
          relative
          overflow-hidden
        "
      >

        <div className="relative z-10 max-w-[650px]">

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-[#477258]
            "
          >
            EcoMinds Dashboard
          </p>

          <h1
            className="
              mt-2
              text-[28px]
              sm:text-[36px]
              font-bold
              text-[#123d26]
            "
          >
            Welcome back, {firstName} 🌱
          </h1>

          <p
            className="
              mt-2
              text-[12px]
              sm:text-[13px]
              leading-5
              text-[#557061]
            "
          >
            Here's a quick look at your plants and their
            current care status.
          </p>


          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/plants")}
              className="
                h-10
                px-5
                rounded-xl
                bg-[#166534]
                hover:bg-[#14532d]
                text-white
                text-[11px]
                font-semibold
                flex
                items-center
                gap-2
              "
            >
              View My Plants

              <ArrowRight size={15} />
            </button>


            <button
              onClick={() => navigate("/reminders")}
              className="
                h-10
                px-5
                rounded-xl
                bg-white
                hover:bg-[#f8fbf8]
                text-[#245b36]
                text-[11px]
                font-semibold
                flex
                items-center
                gap-2
                border
                border-[#c8dfce]
              "
            >
              <Bell size={15} />

              Reminders
            </button>

          </div>

        </div>


        {/* Decorative plant */}

        <Leaf
          className="
            absolute
            right-[-25px]
            bottom-[-35px]
            w-[190px]
            h-[190px]
            text-[#b8d8c0]
            opacity-70
          "
          strokeWidth={0.7}
        />

      </section>


      {/* ================= QUICK STATS ================= */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
          mt-5
        "
      >

        <StatCard
          icon={<Leaf size={18} />}
          title="My Plants"
          value="4"
          subtitle="Plants tracked"
        />

        <StatCard
          icon={<Droplets size={18} />}
          title="Avg. Moisture"
          value="62%"
          subtitle="Soil condition"
        />

        <StatCard
          icon={<Activity size={18} />}
          title="Plant Health"
          value="89%"
          subtitle="Overall health"
        />

        <StatCard
          icon={<Thermometer size={18} />}
          title="Temperature"
          value="27°C"
          subtitle="Current average"
        />

      </section>


      {/* ================= TODAY ================= */}

      <section className="grid lg:grid-cols-[1.6fr_1fr] gap-5 mt-5">

        {/* PLANT STATUS */}

        <div
          className="
            bg-white
            border
            border-[#dce8de]
            rounded-[24px]
            p-5
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] text-[#718078]">
                TODAY
              </p>

              <h2
                className="
                  mt-1
                  text-[18px]
                  font-bold
                  text-[#173f29]
                "
              >
                Plant Status
              </h2>

            </div>


            <button
              onClick={() => navigate("/plants")}
              className="
                text-[10px]
                font-semibold
                text-[#267342]
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
            />

          </div>

        </div>


        {/* TODAY'S CARE */}

        <div
          className="
            bg-white
            border
            border-[#dce8de]
            rounded-[24px]
            p-5
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[#e6f2e8]
              flex
              items-center
              justify-center
            "
          >
            <Droplets
              size={19}
              className="text-[#267342]"
            />
          </div>


          <p
            className="
              mt-5
              text-[10px]
              text-[#718078]
            "
          >
            TODAY'S CARE
          </p>

          <h2
            className="
              mt-1
              text-[19px]
              font-bold
              text-[#173f29]
            "
          >
            Water your plants
          </h2>

          <p
            className="
              mt-2
              text-[11px]
              leading-5
              text-[#7b877f]
            "
          >
            Your Tomato Plant has low soil moisture.
            It may need watering today.
          </p>


          <button
            onClick={() => navigate("/reminders")}
            className="
              mt-5
              w-full
              h-10
              rounded-xl
              bg-[#166534]
              hover:bg-[#14532d]
              text-white
              text-[11px]
              font-semibold
              flex
              items-center
              justify-center
              gap-2
            "
          >
            Check Reminders

            <ArrowRight size={14} />

          </button>

        </div>

      </section>


      {/* ================= QUICK ACTIONS ================= */}

      <section className="mt-5">

        <h2
          className="
            text-[16px]
            font-bold
            text-[#173f29]
          "
        >
          Quick Actions
        </h2>


        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-3
            mt-3
          "
        >

          <QuickAction
            icon={<Plus size={18} />}
            title="Add Plant"
            onClick={() => navigate("/plants")}
          />

          <QuickAction
            icon={<Activity size={18} />}
            title="Monitoring"
            onClick={() => navigate("/monitoring")}
          />

          <QuickAction
            icon={<CloudSun size={18} />}
            title="AI Suggestion"
            onClick={() => navigate("/ai-suggestion")}
          />

          <QuickAction
            icon={<Bell size={18} />}
            title="Reminders"
            onClick={() => navigate("/reminders")}
          />

        </div>

      </section>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div
      className="
        bg-white
        border
        border-[#dce8de]
        rounded-[20px]
        p-4
      "
    >

      <div
        className="
          w-9
          h-9
          rounded-xl
          bg-[#e8f3ea]
          flex
          items-center
          justify-center
          text-[#267342]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-4
          text-[10px]
          text-[#7b877f]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-0.5
          text-[22px]
          font-bold
          text-[#173f29]
        "
      >
        {value}
      </p>

      <p
        className="
          text-[9px]
          text-[#9aa59e]
        "
      >
        {subtitle}
      </p>

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
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        p-3
        rounded-xl
        bg-[#f7faf7]
        border
        border-[#e7eee8]
      "
    >

      <div className="flex items-center gap-3 min-w-0">

        <div
          className="
            w-9
            h-9
            shrink-0
            rounded-xl
            bg-[#dcefe2]
            flex
            items-center
            justify-center
          "
        >
          <Leaf
            size={17}
            className="text-[#347548]"
          />
        </div>


        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-semibold
              text-[#294b35]
              truncate
            "
          >
            {name}
          </p>

          <p
            className="
              mt-0.5
              text-[9px]
              text-[#829087]
            "
          >
            Moisture {moisture} · Health {health}
          </p>

        </div>

      </div>


      <span
        className="
          shrink-0
          px-2.5
          py-1
          rounded-full
          bg-[#e6f3e8]
          text-[8px]
          font-semibold
          text-[#267342]
        "
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
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white
        border
        border-[#dce8de]
        hover:border-[#a9c9b0]
        hover:bg-[#f8fbf8]
        rounded-xl
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
          w-9
          h-9
          rounded-lg
          bg-[#e6f2e8]
          flex
          items-center
          justify-center
          text-[#267342]
        "
      >
        {icon}
      </span>

      <span
        className="
          text-[10px]
          font-semibold
          text-[#31563d]
        "
      >
        {title}
      </span>

    </button>
  );
}


/* =====================================================
   LOGGED-OUT DASHBOARD
===================================================== */

function GuestDashboard() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <section
        className="
          min-h-[520px]
          rounded-[30px]
          bg-[#dcefe2]
          flex
          items-center
          px-6
          sm:px-12
          py-12
        "
      >

        <div className="max-w-[620px]">

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.16em]
              font-semibold
              text-[#477258]
            "
          >
            Smart Plant Care
          </p>

          <h1
            className="
              mt-3
              text-[38px]
              sm:text-[54px]
              leading-[1.05]
              font-bold
              text-[#123d26]
            "
          >
            Take better care
            <br />
            of your plants.
          </h1>

          <p
            className="
              mt-5
              max-w-[500px]
              text-[13px]
              leading-6
              text-[#557061]
            "
          >
            EcoMinds helps you understand your plants,
            track their health and know when they need care.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;