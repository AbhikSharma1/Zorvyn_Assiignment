import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { monthlyData } from "../../data/mockData";
import useStore from "../../store/useStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 13,
      boxShadow: "var(--shadow)",
    }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>${p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

export default function MonthlyBarChart() {
  const darkMode = useStore((s) => s.darkMode);
  const axisColor = darkMode ? "#94a3b8" : "#94a3b8";

  return (
    <div className="chart-card">
      <p className="chart-title">Monthly Comparison</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,.06)" }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="income"   name="Income"   fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
