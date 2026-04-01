import { useState, useMemo } from "react";
import useStore from "../store/useStore";
import TransactionModal from "../components/TransactionModal";
import { CATEGORIES } from "../data/mockData";
import { Plus, Trash2, Pencil, ArrowUpDown, RotateCcw, Download } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function Transactions() {
  const { transactions, deleteTransaction, filters, setFilter, resetFilters, role } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const isAdmin = role === "admin";

  // Apply filters + sort
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") list = list.filter((t) => t.type === filters.type);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);

    list.sort((a, b) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "amount") return (a.amount - b.amount) * dir;
      return (new Date(a.date) - new Date(b.date)) * dir;
    });

    return list;
  }, [transactions, filters]);

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortBy", col);
      setFilter("sortDir", "desc");
    }
  };

  const sortIcon = (col) =>
    filters.sortBy === col ? (filters.sortDir === "asc" ? " ↑" : " ↓") : "";

  const handleEdit = (tx) => { setEditTarget(tx); setShowModal(true); };
  const handleAdd  = () => { setEditTarget(null); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditTarget(null); };

  // CSV export
  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount";
    const rows = filtered.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">All Transactions</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={exportCSV} title="Export CSV">
            <Download size={15} /> Export
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={handleAdd}>
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder="🔍  Search description or category..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <select className="filter-select" value={filters.type} onChange={(e) => setFilter("type", e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-select" value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={resetFilters} title="Reset filters">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Count */}
      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
        Showing <strong>{filtered.length}</strong> of <strong>{transactions.length}</strong> transactions
      </p>

      {/* Table */}
      <div className="table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("date")}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Date <ArrowUpDown size={12} />{sortIcon("date")}
                  </span>
                </th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => toggleSort("amount")}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Amount <ArrowUpDown size={12} />{sortIcon("amount")}
                  </span>
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: "var(--text2)" }}>{tx.date}</td>
                  <td>{tx.description}</td>
                  <td><span className="category-chip">{tx.category}</span></td>
                  <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                  <td className={`amount-${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="icon-btn"
                          onClick={() => handleEdit(tx)}
                          title="Edit"
                          style={{ width: 30, height: 30 }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete"
                          style={{ width: 30, height: 30, color: "var(--red)" }}
                        >
                          <Trash2 size={13} />
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

      {showModal && (
        <TransactionModal existing={editTarget} onClose={handleClose} />
      )}
    </>
  );
}
