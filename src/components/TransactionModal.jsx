import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { CATEGORIES } from "../data/mockData";
import { X } from "lucide-react";

const empty = { description: "", amount: "", category: "Food", type: "expense", date: "" };

export default function TransactionModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useStore();
  const [form, setForm] = useState(existing || { ...empty, date: new Date().toISOString().split("T")[0] });
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError("Enter a valid positive amount.");
    if (!form.date) return setError("Date is required.");
    const payload = { ...form, amount: parseFloat(form.amount) };
    existing ? editTransaction(existing.id, payload) : addTransaction(payload);
    onClose();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5";

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[200] p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold">{existing ? "Edit Transaction" : "Add Transaction"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-105 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>Description</label>
            <input className={inputCls} name="description" value={form.description} onChange={handleChange} placeholder="e.g. Grocery shopping" autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount ($)</label>
              <input className={inputCls} name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls} name="date" type="date" value={form.date} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} name="type" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.filter((c) => c !== "Income").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-md transition-all">
              {existing ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
