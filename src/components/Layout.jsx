import useStore from "../store/useStore";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights",     label: "Insights",     icon: Lightbulb },
];

export default function Layout({ children }) {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles = { dashboard: "Dashboard", transactions: "Transactions", insights: "Insights" };

  const navigate = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-[99] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-screen w-60 z-[100]
          bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          flex flex-col px-4 py-6
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0
        `}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 pb-6 mb-5 border-b border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-lg">
              💰
            </div>
            <span className="text-[17px] font-bold">
              Fin<span className="text-indigo-500">Track</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`
                  flex items-center gap-3 px-3 py-[11px] rounded-xl text-sm font-medium w-full text-left
                  transition-all duration-150 cursor-pointer
                  ${activePage === id
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1"
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          {/* Role switcher */}
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">Role</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 cursor-pointer transition-colors"
            >
              <option value="viewer">👁 Viewer</option>
              <option value="admin">🛡 Admin</option>
            </select>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-60 w-full min-w-0">

          {/* Topbar */}
          <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-7 py-3.5 flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1 text-slate-600 dark:text-slate-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <span className="text-base md:text-lg font-bold">{pageTitles[activePage]}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                role === "admin"
                  ? "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}>
                {role === "admin" ? "🛡 Admin" : "👁 Viewer"}
              </span>
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-150"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 p-4 md:p-7 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
