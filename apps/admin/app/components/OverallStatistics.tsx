export function OverallStatistics({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const stats = [
    { label: "Total Placements", value: "156", delta: "+12 this week", color: "#6366f1" },
    { label: "Total Internships", value: "89", delta: "+15 active", color: "#22c55e" },
    { label: "Avg Package", value: "₹12.5 LPA", delta: "+1.2 LPA YoY", color: "#334155" },
    { label: "Placement Rate", value: "71.4%", delta: "+3.4% improvement", color: "#f97316" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, margin: "0 24px 24px" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: "0 0 16px" }}>Overall Statistics</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "20px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 12, color: stat.color, fontWeight: 500, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{stat.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
