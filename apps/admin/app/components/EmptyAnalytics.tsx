import { BarChart3 } from "lucide-react";
export function EmptyAnalytics() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "60px 24px",
        margin: "0 2px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
          opacity: 0.6,
        }}
      >
        <BarChart3 size={48} color="blue" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: "0 0 8px" }}>No Analytics Data Displayed</h3>
      <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 20px" }}>
        Please apply one or more filters above to visualize detailed
        <br />
        placement and internship analytics.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {["📅 Date Range", "🏢 Department", "💼 Job Type", "👥 Company"].map((f) => (
          <span key={f} style={{ fontSize: 13, color: "#64748b" }}>
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
