import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "My Plants", path: "/plants", icon: "🌱" },
    { name: "History", path: "/history", icon: "📊" },
    { name: "Reminders", path: "/reminders", icon: "🔔" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-4 md:block">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;