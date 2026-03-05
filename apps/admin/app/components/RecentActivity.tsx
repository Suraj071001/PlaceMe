"use client";

import { recentActivity, type ActivityItem } from "./data";

export function RecentActivity({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "14px 18px",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Recent Activity</h3>
        <button style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>View All</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "space-between" }}>
        {recentActivity.slice(0, 5).map((item: ActivityItem, idx: number) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{item.desc}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.time}</div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "2px 10px",
                borderRadius: 12,
                background: item.tag === "job" ? "#ede9fe" : item.tag === "placement" ? "#dcfce7" : item.tag === "recruiter" ? "#fff7ed" : "#fef9c3",
                color: item.tag === "job" ? "#6366f1" : item.tag === "placement" ? "#22c55e" : item.tag === "recruiter" ? "#f97316" : "#eab308",
              }}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
