import { useState, useMemo, useRef } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useStore from "../store/useStore";
import TransactionModal from "../components/TransactionModal";
import Toast from "../components/Toast";
import { CATEGORIES } from "../data/mockData";
import { Plus, Trash2, Pencil, ArrowUpDown, RotateCcw, Download } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function Transactions() {
  const { transactions, deleteTransaction, filters, setFilter, resetFilters, role } = useStore();
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast]           = useState(null); // "add" | "edit" | "delete" | null
  const [tbodyRef]                  = useAutoAnimate();
  const isAdmin = role === "admin";

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.type !== "all")     list = list.filter((t) => t.type === filters.type);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    list.sort((a, b) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "amount") return (a.amount - b.amount) * dir;
      return (new Date(a.date) - new Date(b.date)) * dir;
    });
    return list;
  }, [transactions, filters]);

  const toggleSort = (col) => {
    if (filters.sortBy === col) setFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc");
    else { setFilter("sortBy", col); setFilter("sortDir", "desc"); }
  };

  const sortIcon = (col) => filters.sortBy === col ? (filters.sortDir === "asc" ? " ↑" : " ↓") : "";

  const handleClose   = () => { setShowModal(false); setEditTarget(null); };
  const handleSuccess = (type) => setToast(type);

  const handleDelete = (id) => {
    deleteTransaction(id);
    setToast("delete");
  };

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount";
    const rows = filtered.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors";
  const btnGhost = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:-translate-y-0.5 hover:shadow-md transition-all";

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold">All Transactions</h2>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={exportCSV}>
            <Download size={14} /> Export
          </button>
          {isAdmin && (
            <button
              onClick={() => { setEditTarget(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-4">
        <input
          className={`${inputCls} flex-1 min-w-[180px]`}
          placeholder="🔍  Search description or category..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <select className={inputCls} value={filters.type} onChange={(e) => setFilter("type", e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={inputCls} value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className={btnGhost} onClick={resetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Showing <strong className="text-slate-600 dark:text-slate-300">{filtered.length}</strong> of <strong className="text-slate-600 dark:text-slate-300">{transactions.length}</strong> transactions
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No transactions match your filters.</p>
          </div>
        ) : (
          <table className="w-full min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors select-none" onClick={() => toggleSort("date")}>
                  <span className="flex items-center gap-1">Date <ArrowUpDown size={11} />{sortIcon("date")}</span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">Description</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">Category</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">Type</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors select-none" onClick={() => toggleSort("amount")}>
                  <span className="flex items-center gap-1">Amount <ArrowUpDown size={11} />{sortIcon("amount")}</span>
                </th>
                {isAdmin && <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">Actions</th>}
              </tr>
            </thead>
            {/* auto-animate on tbody so rows animate when filtered/sorted */}
            <tbody ref={tbodyRef}>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-400">{tx.date}</td>
                  <td className="px-4 py-3 text-sm">{tx.description}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{tx.category}</span></td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${tx.type === "income" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-500"}`}>{tx.type}</span></td>
                  <td className={`px-4 py-3 text-sm font-semibold ${tx.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditTarget(tx); setShowModal(true); }}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:scale-110 transition-all"
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction form modal */}
      {showModal && (
        <TransactionModal
          existing={editTarget}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}

      {/* Admin action toast */}
      {toast && <Toast type={toast} onClose={() => setToast(null)} />}
    </>
  );
}
