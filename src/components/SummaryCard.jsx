export default function SummaryCard({ label, value, icon, iconBg, sub, subType }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col gap-2.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {sub && (
        <div className={`text-xs font-medium ${
          subType === "up"   ? "text-emerald-500" :
          subType === "down" ? "text-red-500" :
          "text-slate-400"
        }`}>
          {sub}
        </div>
      )}
    </div>
  );
}
