import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { CATEGORIES } from "../data/mockData";
import { X } from "lucide-react";

const empty = { description: "", amount: "", category: "Food", type: "expense", date: "" };

export default function TransactionModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useStore();
  const [form, setForm] = useState(existing || { ...empty, date: new Date().toISOString().split("T")[0] });
  const [error, setError] = useState("");

  // Close on Escape key
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

    if (existing) {
      editTransaction(existing.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {existing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                className="form-input"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>Type</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.filter((c) => c !== "Income").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 10 }}>{error}</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {existing ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
