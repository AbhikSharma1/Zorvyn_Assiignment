import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { categoryData } from "../../data/mockData";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Scale radii down on mobile so the pie fits without clipping
  const innerR = isMobile ? 45 : 65;
  const outerR = isMobile ? 75 : 100;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 md:p-5 shadow-sm">
      <p className="text-sm font-semibold mb-2 text-slate-800 dark:text-white">Spending by Category</p>
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 280}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy={isMobile ? "42%" : "45%"}
            innerRadius={innerR}
            outerRadius={outerR}
            paddingAngle={3}
            dataKey="value"
          >
            {categoryData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: isMobile ? 11 : 12, paddingTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
