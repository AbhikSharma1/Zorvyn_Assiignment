// Reusable summary card with animated hover
export default function SummaryCard({ label, value, icon, iconBg, sub, subType }) {
  return (
    <div className="summary-card">
      <div className="card-header">
        <span className="card-label">{label}</span>
        <div className="card-icon" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className="card-value">{value}</div>
      {sub && (
        <div className="card-sub">
          <span className={subType}>{sub}</span>
        </div>
      )}
    </div>
  );
}
