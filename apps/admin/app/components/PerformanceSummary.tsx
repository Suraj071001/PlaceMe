"use client";
import { useState, useEffect } from "react";

export function PerformanceSummary({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/analytics/stats");
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [appliedFilters]);

  if (loading || !stats) {
    return <div className="h-full w-full min-h-[200px] animate-pulse bg-slate-100 rounded-xl flex items-center justify-center text-sm text-slate-400">Loading Summary...</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px", height: "100%", boxSizing: "border-box" }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: "0 0 12px" }}>Overall Performance Summary</h3>

      {/* Placement Rate Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: "#6366f1", fontWeight: 500 }}>Overall Placement Rate</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}>{stats.placementRate}</span>
      </div>
      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
        <div
          style={{ height: "100%", width: stats.placementRate, background: "linear-gradient(90deg, #6366f1, #22c55e)", borderRadius: 4, transition: "width 0.5s ease" }}
        />
      </div>

      {/* Stat Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Target", value: "75%" },
          { label: "Previous Year", value: "68%" },
          { label: "YoY Growth", value: "+3.4%", color: "#22c55e" },
          { label: "Success Rate", value: "12.5%" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: item.color || "#1e293b" }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { label: "Total Placements", value: `${stats.studentsPlaced} students` },
          { label: "Total Target (Eligible)", value: `${stats.eligibleStudents} students` },
          { label: "Total Visiting Companies", value: `${stats.companiesVisited} companies` },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#64748b" }}>{item.label}</span>
            <span style={{ fontWeight: 600, color: "#6366f1" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
