import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/users", label: "Users" },
    { path: "/documents", label: "Documents" },
    { path: "/tasks", label: "Tasks" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#1E3A5F] text-white flex flex-col px-5 py-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-8 tracking-wide">DocuTask</h2>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#2563EB] text-white shadow"
                  : "text-blue-100 hover:bg-[#2C4A6B] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}