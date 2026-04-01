import { useMemo } from "react";
import useStore from "../store/useStore";
import SummaryCard from "../components/SummaryCard";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import SpendingPieChart from "../components/charts/SpendingPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);

  const { totalIncome, totalExpenses, balance, savingsRate } = useMemo(() => {
    const totalIncome   = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance       = totalIncome - totalExpenses;
    const savingsRate   = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  const recent = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Balance"  value={fmt(balance)}       icon="💳" iconBg="rgba(99,102,241,.15)"  sub={`${savingsRate}% savings rate`} subType={savingsRate >= 20 ? "up" : "down"} />
        <SummaryCard label="Total Income"   value={fmt(totalIncome)}   icon="📈" iconBg="rgba(34,197,94,.15)"   sub="↑ All time" subType="up" />
        <SummaryCard label="Total Expenses" value={fmt(totalExpenses)} icon="📉" iconBg="rgba(239,68,68,.15)"   sub="↓ All time" subType="down" />
        <SummaryCard label="Transactions"   value={transactions.length} icon="🔄" iconBg="rgba(245,158,11,.15)" sub="Total recorded" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <BalanceTrendChart />
        <SpendingPieChart />
        <MonthlyBarChart />
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
          {recent.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No transactions yet.</p>
            </div>
          ) : (
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40">
                  {["Date", "Description", "Category", "Type", "Amount"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-400">{tx.date}</td>
                    <td className="px-4 py-3 text-sm">{tx.description}</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{tx.category}</span></td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${tx.type === "income" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-500"}`}>{tx.type}</span></td>
                    <td className={`px-4 py-3 text-sm font-semibold ${tx.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
