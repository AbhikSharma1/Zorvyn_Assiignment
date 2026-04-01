import { useMemo } from "react";
import useStore from "../store/useStore";
import { monthlyData, categoryData } from "../data/mockData";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function Insights() {
  const transactions = useStore((s) => s.transactions);

  const stats = useMemo(() => {
    const totalIncome   = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    // Highest spending category
    const topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];

    // Best savings month
    const bestMonth = [...monthlyData].sort(
      (a, b) => (b.income - b.expenses) - (a.income - a.expenses)
    )[0];

    // Worst spending month
    const worstMonth = [...monthlyData].sort((a, b) => b.expenses - a.expenses)[0];

    // Avg monthly expense
    const avgExpense = Math.round(monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length);

    // Savings rate
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // Most recent month vs previous
    const last  = monthlyData[monthlyData.length - 1];
    const prev  = monthlyData[monthlyData.length - 2];
    const expenseDiff = last.expenses - prev.expenses;

    return { topCategory, bestMonth, worstMonth, avgExpense, savingsRate, last, prev, expenseDiff, totalIncome, totalExpenses };
  }, [transactions]);

  const totalSpend = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Financial Insights</h2>
      </div>

      <div className="insights-grid">
        {/* Savings Rate */}
        <div className="insight-card">
          <div className="insight-icon">💰</div>
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: stats.savingsRate >= 20 ? "var(--green)" : "var(--red)" }}>
            {stats.savingsRate}%
          </div>
          <div className="insight-desc">
            {stats.savingsRate >= 20
              ? "Great job! You're saving more than 20% of your income."
              : "Try to save at least 20% of your income each month."}
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(stats.savingsRate, 100)}%`,
                background: stats.savingsRate >= 20 ? "var(--green)" : "var(--red)",
              }}
            />
          </div>
        </div>

        {/* Top Spending Category */}
        <div className="insight-card">
          <div className="insight-icon">🏆</div>
          <div className="insight-label">Highest Spending Category</div>
          <div className="insight-value" style={{ color: stats.topCategory.color }}>
            {stats.topCategory.name}
          </div>
          <div className="insight-desc">
            {fmt(stats.topCategory.value)} spent — {Math.round((stats.topCategory.value / totalSpend) * 100)}% of total expenses.
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.round((stats.topCategory.value / totalSpend) * 100)}%`,
                background: stats.topCategory.color,
              }}
            />
          </div>
        </div>

        {/* Best Savings Month */}
        <div className="insight-card">
          <div className="insight-icon">📅</div>
          <div className="insight-label">Best Savings Month</div>
          <div className="insight-value" style={{ color: "var(--green)" }}>
            {stats.bestMonth.month}
          </div>
          <div className="insight-desc">
            Saved {fmt(stats.bestMonth.income - stats.bestMonth.expenses)} with income of {fmt(stats.bestMonth.income)} and expenses of {fmt(stats.bestMonth.expenses)}.
          </div>
        </div>

        {/* Highest Expense Month */}
        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-label">Highest Expense Month</div>
          <div className="insight-value" style={{ color: "var(--red)" }}>
            {stats.worstMonth.month}
          </div>
          <div className="insight-desc">
            Spent {fmt(stats.worstMonth.expenses)} — {fmt(stats.worstMonth.expenses - stats.avgExpense)} above the monthly average.
          </div>
        </div>

        {/* Avg Monthly Expense */}
        <div className="insight-card">
          <div className="insight-icon">📉</div>
          <div className="insight-label">Avg Monthly Expense</div>
          <div className="insight-value">{fmt(stats.avgExpense)}</div>
          <div className="insight-desc">
            Based on the last 6 months of recorded spending data.
          </div>
        </div>

        {/* Month over Month */}
        <div className="insight-card">
          <div className="insight-icon">{stats.expenseDiff > 0 ? "⚠️" : "✅"}</div>
          <div className="insight-label">Month-over-Month Expenses</div>
          <div
            className="insight-value"
            style={{ color: stats.expenseDiff > 0 ? "var(--red)" : "var(--green)" }}
          >
            {stats.expenseDiff > 0 ? "+" : ""}{fmt(stats.expenseDiff)}
          </div>
          <div className="insight-desc">
            {stats.last.month} vs {stats.prev.month}: expenses{" "}
            {stats.expenseDiff > 0 ? "increased" : "decreased"} by {fmt(Math.abs(stats.expenseDiff))}.
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Category Breakdown</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount Spent</th>
                <th>% of Total</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {[...categoryData]
                .sort((a, b) => b.value - a.value)
                .map((cat) => {
                  const pct = Math.round((cat.value / totalSpend) * 100);
                  return (
                    <tr key={cat.name}>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
                          {cat.name}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{fmt(cat.value)}</td>
                      <td style={{ color: "var(--text2)" }}>{pct}%</td>
                      <td style={{ width: 180 }}>
                        <div className="progress-bar-wrap">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${pct}%`, background: cat.color }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
