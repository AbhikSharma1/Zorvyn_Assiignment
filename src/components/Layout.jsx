import useStore from "../store/useStore";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights",     label: "Insights",     icon: Lightbulb },
];

export default function Layout({ children }) {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles = {
    dashboard:    "Dashboard",
    transactions: "Transactions",
    insights:     "Insights",
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`app-layout ${darkMode ? "dark" : ""}`}>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">💰</div>
          <span>Fin<em>Track</em></span>
        </div>

        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? "active" : ""}`}
              onClick={() => { setActivePage(id); closeSidebar(); }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div style={{ fontSize: 12, color: "var(--text2)", padding: "0 8px 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
            Role
          </div>
          <select
            className="role-select"
            style={{ width: "100%" }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">🛡 Admin</option>
          </select>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="topbar-title">{pageTitles[activePage]}</span>
          </div>

          <div className="topbar-right">
            <span className={`role-badge ${role}`}>
              {role === "admin" ? "🛡 Admin" : "👁 Viewer"}
            </span>
            <button className="icon-btn" onClick={toggleDarkMode} title="Toggle dark mode">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="page">{children}</main>
      </div>
    </div>
  );
}
