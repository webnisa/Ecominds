import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import logo from "../assets/logo.jpeg";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

const navItems = [
  {
    name: "Home",
    path: "/",
    public: true,
  },
  {
    name: "My Plant",
    path: "/plants",
    public: false,
  },
  {
    name: "AI Suggestion",
    path: "/ai-suggestion",
    public: false,
  },
  {
    name: "Monitoring",
    path: "/monitoring",
    public: false,
  },
  {
    name: "To-Do List",
    path: "/todo",
    public: false,
  },
];

function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  // =========================================================
  // FETCH UNREAD REMINDER COUNT
  // =========================================================

  useEffect(() => {
    let interval;

    const fetchUnreadCount =
      async () => {
        if (
          !isLoaded ||
          !isSignedIn
        ) {
          setUnreadCount(0);
          return;
        }

        try {
          const token =
            await getToken();

          if (!token) {
            return;
          }

          const response =
            await fetch(
              `${BACKEND_URL}/api/reminders/unread-count`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          const data =
            await response.json();

          console.log(
            "🔔 Unread reminders:",
            data
          );

          if (response.ok) {
            setUnreadCount(
              data.count || 0
            );
          }
        } catch (error) {
          console.error(
            "❌ Notification count error:",
            error
          );
        }
      };

    fetchUnreadCount();

    // Check every 30 seconds
    interval = setInterval(
      fetchUnreadCount,
      30000
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#d5e5d9]
        bg-white/95
        backdrop-blur
      "
    >
      <div
        className="
          max-w-[1400px]
          mx-auto
          h-[76px]
          px-4
          sm:px-6
          md:px-8
          flex
          items-center
          justify-between
        "
      >

        {/* =====================================================
            LOGO
        ===================================================== */}

        <NavLink
          to="/"
          onClick={
            closeMobileMenu
          }
          className="
            flex
            items-center
            gap-2.5
            shrink-0
          "
        >
          <img
            src={logo}
            alt="EcoMinds Logo"
            className="
              w-10
              h-10
              object-contain
            "
          />

          <div>
            <h1
              className="
                text-[19px]
                font-bold
                tracking-tight
                text-[#14532d]
              "
            >
              EcoMinds
            </h1>

            <p
              className="
                text-[10px]
                text-[#6b7f70]
                -mt-0.5
              "
            >
              Smart Plant Care
            </p>
          </div>
        </NavLink>

        {/* =====================================================
            DESKTOP NAV
        ===================================================== */}

        <nav
          className="
            hidden
            lg:flex
            items-center
            gap-1
          "
        >
          {navItems.map(
            (item) =>
              item.public ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({
                    isActive,
                  }) =>
                    `
                    px-4
                    py-2
                    rounded-lg
                    text-[15px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#dcefe2] text-[#14532d]"
                        : "text-[#657267] hover:bg-[#f0f6f1] hover:text-[#14532d]"
                    }
                    `
                  }
                >
                  {item.name}
                </NavLink>
              ) : (
                <SignedIn
                  key={item.path}
                >
                  <NavLink
                    to={item.path}
                    className={({
                      isActive,
                    }) =>
                      `
                      px-4
                      py-2
                      rounded-lg
                      text-[15px]
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#dcefe2] text-[#14532d]"
                          : "text-[#657267] hover:bg-[#f0f6f1] hover:text-[#14532d]"
                      }
                      `
                    }
                  >
                    {item.name}
                  </NavLink>
                </SignedIn>
              )
          )}

          {/* LOGGED OUT PRIVATE LINKS */}

          <SignedOut>
            {navItems
              .filter(
                (item) =>
                  !item.public
              )
              .map((item) => (
                <SignInButton
                  key={item.path}
                  mode="modal"
                >
                  <button
                    type="button"
                    className="
                      px-4
                      py-2
                      rounded-lg
                      text-[15px]
                      font-medium
                      text-[#657267]
                      hover:bg-[#f0f6f1]
                      hover:text-[#14532d]
                      transition-all
                    "
                  >
                    {item.name}
                  </button>
                </SignInButton>
              ))}
          </SignedOut>
        </nav>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* ===================================================
              NOTIFICATION BELL
          =================================================== */}

          <SignedIn>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/reminders"
                )
              }
              title="Reminders"
              className="
                relative
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-[#53645a]
                hover:bg-[#eef5ef]
                transition
              "
            >
              <Bell
                size={18}
                strokeWidth={1.8}
              />

              {/* RED BADGE */}

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[17px]
                    h-[17px]
                    px-1
                    rounded-full
                    bg-[#dc2626]
                    text-white
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>
          </SignedIn>

          {/* ===================================================
              LOGGED OUT
          =================================================== */}

          <SignedOut>
            <div
              className="
                hidden
                sm:flex
                items-center
                gap-2
              "
            >
              <SignUpButton
                mode="modal"
              >
                <button
                  type="button"
                  className="
                    w-[82px]
                    h-[36px]
                    rounded-lg
                    bg-[#166534]
                    hover:bg-[#14532d]
                    text-white
                    text-[15px]
                    font-semibold
                    transition
                  "
                >
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton
                mode="modal"
              >
                <button
                  type="button"
                  className="
                    w-[82px]
                    h-[36px]
                    rounded-lg
                    bg-[#166534]
                    hover:bg-[#14532d]
                    text-white
                    text-[15px]
                    font-semibold
                    transition
                  "
                >
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* ===================================================
              USER
          =================================================== */}

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-8 h-8",
                },
              }}
            />
          </SignedIn>

          {/* ===================================================
              MOBILE
          =================================================== */}

          <button
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            className="
              lg:hidden
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-[#14532d]
              hover:bg-[#eef5ef]
            "
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            lg:hidden
            border-t
            border-[#d5e5d9]
            bg-white
            px-4
            py-4
            shadow-sm
          "
        >
          <nav
            className="
              flex
              flex-col
              gap-1
            "
          >

            {/* HOME */}

            <NavLink
              to="/"
              onClick={
                closeMobileMenu
              }
              className={({
                isActive,
              }) =>
                `
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium

                ${
                  isActive
                    ? "bg-[#dcefe2] text-[#14532d]"
                    : "text-[#657267]"
                }
                `
              }
            >
              Home
            </NavLink>

            {/* PRIVATE */}

            <SignedIn>
              {navItems
                .filter(
                  (item) =>
                    !item.public
                )
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={
                      closeMobileMenu
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                      px-4
                      py-3
                      rounded-lg
                      text-sm
                      font-medium

                      ${
                        isActive
                          ? "bg-[#dcefe2] text-[#14532d]"
                          : "text-[#657267]"
                      }
                      `
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

              {/* MOBILE REMINDERS */}

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate(
                    "/reminders"
                  );
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-3
                  rounded-lg
                  text-sm
                  font-medium
                  text-[#657267]
                  hover:bg-[#f0f6f1]
                  hover:text-[#14532d]
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="flex items-center gap-2">
                  <Bell size={16} />
                  Reminders
                </span>

                {unreadCount > 0 && (
                  <span
                    className="
                      min-w-[20px]
                      h-5
                      px-1.5
                      rounded-full
                      bg-[#dc2626]
                      text-white
                      text-[9px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>
            </SignedIn>

            {/* LOGGED OUT PRIVATE */}

            <SignedOut>
              {navItems
                .filter(
                  (item) =>
                    !item.public
                )
                .map((item) => (
                  <SignInButton
                    key={item.path}
                    mode="modal"
                  >
                    <button
                      type="button"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        rounded-lg
                        text-sm
                        font-medium
                        text-[#657267]
                        hover:bg-[#f0f6f1]
                        hover:text-[#14532d]
                      "
                    >
                      {item.name}
                    </button>
                  </SignInButton>
                ))}
            </SignedOut>

            {/* MOBILE LOGIN */}

            <SignedOut>
              <div
                className="
                  flex
                  gap-2
                  pt-3
                  mt-2
                  border-t
                  border-[#edf2ee]
                "
              >
                <SignInButton
                  mode="modal"
                >
                  <button
                    className="
                      flex-1
                      h-10
                      rounded-lg
                      bg-[#166534]
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton
                  mode="modal"
                >
                  <button
                    className="
                      flex-1
                      h-10
                      rounded-lg
                      border
                      border-[#166534]
                      text-[#166534]
                      text-sm
                      font-semibold
                    "
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;