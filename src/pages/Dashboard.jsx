import useStore from "../store/useStore";
import SummaryCard from "../components/SummaryCard";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import SpendingPieChart from "../components/charts/SpendingPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import { useMemo } from "react";

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

  // Recent 5 transactions
  const recent = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
    [transactions]
  );

  return (
    <>
      {/* Summary Cards */}
      <div className="cards-grid">
        <SummaryCard
          label="Total Balance"
          value={fmt(balance)}
          icon="💳"
          iconBg="rgba(99,102,241,.15)"
          sub={`${savingsRate}% savings rate`}
          subType={savingsRate >= 20 ? "up" : "down"}
        />
        <SummaryCard
          label="Total Income"
          value={fmt(totalIncome)}
          icon="📈"
          iconBg="rgba(34,197,94,.15)"
          sub="↑ All time"
          subType="up"
        />
        <SummaryCard
          label="Total Expenses"
          value={fmt(totalExpenses)}
          icon="📉"
          iconBg="rgba(239,68,68,.15)"
          sub="↓ All time"
          subType="down"
        />
        <SummaryCard
          label="Transactions"
          value={transactions.length}
          icon="🔄"
          iconBg="rgba(245,158,11,.15)"
          sub="Total recorded"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <BalanceTrendChart />
        <SpendingPieChart />
        <MonthlyBarChart />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
        </div>
        <div className="table-wrapper">
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No transactions yet.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: "var(--text2)" }}>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td><span className="category-chip">{tx.category}</span></td>
                    <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                    <td className={`amount-${tx.type}`}>
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
