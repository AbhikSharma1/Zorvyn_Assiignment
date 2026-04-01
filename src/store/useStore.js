import { create } from "zustand";
import { transactions as initialTransactions } from "../data/mockData";

// Load persisted data from localStorage if available
const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const useStore = create((set, get) => ({
  // Role management
  role: loadFromStorage("role", "viewer"), // "viewer" | "admin"
  setRole: (role) => {
    localStorage.setItem("role", JSON.stringify(role));
    set({ role });
  },

  // Dark mode
  darkMode: loadFromStorage("darkMode", false),
  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem("darkMode", JSON.stringify(next));
    set({ darkMode: next });
  },

  // Transactions
  transactions: loadFromStorage("transactions", initialTransactions),
  addTransaction: (tx) => {
    const updated = [{ ...tx, id: Date.now() }, ...get().transactions];
    localStorage.setItem("transactions", JSON.stringify(updated));
    set({ transactions: updated });
  },
  editTransaction: (id, updated) => {
    const list = get().transactions.map((t) => (t.id === id ? { ...t, ...updated } : t));
    localStorage.setItem("transactions", JSON.stringify(list));
    set({ transactions: list });
  },
  deleteTransaction: (id) => {
    const list = get().transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(list));
    set({ transactions: list });
  },

  // Filters for transactions page
  filters: {
    search: "",
    type: "all",       // "all" | "income" | "expense"
    category: "all",
    sortBy: "date",    // "date" | "amount"
    sortDir: "desc",   // "asc" | "desc"
  },
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () =>
    set({ filters: { search: "", type: "all", category: "all", sortBy: "date", sortDir: "desc" } }),

  // Active page
  activePage: "dashboard",
  setActivePage: (page) => set({ activePage: page }),
}));

export default useStore;
