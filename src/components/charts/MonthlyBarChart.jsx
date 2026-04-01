import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyData } from "../../data/mockData";
import useStore from "../../store/useStore";
import { useEffect, useState } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm shadow-lg">
      <p className="font-bold mb-1.5 text-slate-800 dark:text-white">{label}</p>
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
  const axisColor = "#94a3b8";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 md:p-5 shadow-sm">
      <p className="text-sm font-semibold mb-4 text-slate-800 dark:text-white">Monthly Comparison</p>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
        <BarChart
          data={monthlyData}
          margin={{ top: 5, right: 5, left: isMobile ? -20 : 0, bottom: 0 }}
          barGap={isMobile ? 2 : 4}
          barCategoryGap={isMobile ? "25%" : "30%"}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
            width={isMobile ? 36 : 45}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,.06)" }} />
          <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 13 }} />
          <Bar dataKey="income"   name="Income"   fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
