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
    const topCategory   = [...categoryData].sort((a, b) => b.value - a.value)[0];
    const bestMonth     = [...monthlyData].sort((a, b) => (b.income - b.expenses) - (a.income - a.expenses))[0];
    const worstMonth    = [...monthlyData].sort((a, b) => b.expenses - a.expenses)[0];
    const avgExpense    = Math.round(monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length);
    const savingsRate   = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    const last          = monthlyData[monthlyData.length - 1];
    const prev          = monthlyData[monthlyData.length - 2];
    const expenseDiff   = last.expenses - prev.expenses;
    return { topCategory, bestMonth, worstMonth, avgExpense, savingsRate, last, prev, expenseDiff };
  }, [transactions]);

  const totalSpend = categoryData.reduce((s, c) => s + c.value, 0);

  const cardCls = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200";

  return (
    <>
      <h2 className="text-lg font-bold mb-5">Financial Insights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">

        {/* Savings Rate */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">💰</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Savings Rate</p>
          <p className={`text-2xl font-bold mb-1 ${stats.savingsRate >= 20 ? "text-emerald-500" : "text-red-500"}`}>{stats.savingsRate}%</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            {stats.savingsRate >= 20 ? "Great job! You're saving more than 20% of your income." : "Try to save at least 20% of your income each month."}
          </p>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full progress-fill ${stats.savingsRate >= 20 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(stats.savingsRate, 100)}%` }} />
          </div>
        </div>

        {/* Top Category */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Highest Spending Category</p>
          <p className="text-2xl font-bold mb-1" style={{ color: stats.topCategory.color }}>{stats.topCategory.name}</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            {fmt(stats.topCategory.value)} spent — {Math.round((stats.topCategory.value / totalSpend) * 100)}% of total expenses.
          </p>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full progress-fill" style={{ width: `${Math.round((stats.topCategory.value / totalSpend) * 100)}%`, background: stats.topCategory.color }} />
          </div>
        </div>

        {/* Best Savings Month */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">📅</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Best Savings Month</p>
          <p className="text-2xl font-bold text-emerald-500 mb-1">{stats.bestMonth.month}</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Saved {fmt(stats.bestMonth.income - stats.bestMonth.expenses)} with income of {fmt(stats.bestMonth.income)} and expenses of {fmt(stats.bestMonth.expenses)}.
          </p>
        </div>

        {/* Highest Expense Month */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">📊</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Highest Expense Month</p>
          <p className="text-2xl font-bold text-red-500 mb-1">{stats.worstMonth.month}</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Spent {fmt(stats.worstMonth.expenses)} — {fmt(stats.worstMonth.expenses - stats.avgExpense)} above the monthly average.
          </p>
        </div>

        {/* Avg Monthly Expense */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">📉</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Avg Monthly Expense</p>
          <p className="text-2xl font-bold mb-1">{fmt(stats.avgExpense)}</p>
          <p className="text-xs text-slate-400 leading-relaxed">Based on the last 6 months of recorded spending data.</p>
        </div>

        {/* Month-over-Month */}
        <div className={cardCls}>
          <div className="text-3xl mb-2">{stats.expenseDiff > 0 ? "⚠️" : "✅"}</div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Month-over-Month Expenses</p>
          <p className={`text-2xl font-bold mb-1 ${stats.expenseDiff > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {stats.expenseDiff > 0 ? "+" : ""}{fmt(stats.expenseDiff)}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {stats.last.month} vs {stats.prev.month}: expenses {stats.expenseDiff > 0 ? "increased" : "decreased"} by {fmt(Math.abs(stats.expenseDiff))}.
          </p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <h3 className="text-base font-bold mb-3">Category Breakdown</h3>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40">
              {["Category", "Amount Spent", "% of Total", "Visual"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...categoryData].sort((a, b) => b.value - a.value).map((cat) => {
              const pct = Math.round((cat.value / totalSpend) * 100);
              return (
                <tr key={cat.name} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{fmt(cat.value)}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{pct}%</td>
                  <td className="px-4 py-3 w-40">
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
