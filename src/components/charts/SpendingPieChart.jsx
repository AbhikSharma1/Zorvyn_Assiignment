import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { categoryData } from "../../data/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm shadow-lg">
      <p className="font-bold" style={{ color: d.payload.color }}>{d.name}</p>
      <p className="text-slate-700 dark:text-slate-200">${d.value.toLocaleString()}</p>
    </div>
  );
};

export default function SpendingPieChart() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <p className="text-sm font-semibold mb-4 text-slate-800 dark:text-slate-100">Spending by Category</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
            {categoryData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
