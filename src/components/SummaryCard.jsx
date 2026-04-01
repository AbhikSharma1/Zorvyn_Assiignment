import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

export default function SummaryCard({ label, value, icon, iconBg, sub, subType }) {
  // Extract numeric part for the ticker, keep the rest (e.g. "$" prefix)
  const isNumeric = typeof value === "number";
  const numericValue = isNumeric
    ? value
    : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
  const prefix = isNumeric ? "" : String(value).replace(/[\d,.-]+.*/, "");

  const counted = useCountUp(numericValue);

  // Format the counted number the same way as the original value
  const displayValue = isNumeric
    ? counted
    : String(value).replace(/[\d,]+/, counted.toLocaleString());

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 24px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col gap-2.5 shadow-sm cursor-default"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight">{displayValue}</div>
      {sub && (
        <div className={`text-xs font-medium ${
          subType === "up"   ? "text-emerald-500" :
          subType === "down" ? "text-red-500" :
          "text-slate-400"
        }`}>
          {sub}
        </div>
      )}
    </motion.div>
  );
}
