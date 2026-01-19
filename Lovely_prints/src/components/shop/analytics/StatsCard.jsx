export default function StatsCard({ label, value }) {
  return (
    <div className="stats-card">
      <p className="stats-label">{label}</p>
      <h2 className="stats-value">{value}</h2>
    </div>
  );
}
