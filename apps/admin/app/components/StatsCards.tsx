"use client";

import { stats, departments } from "./data";

export function StatsCards({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  let displayStats = stats;

  if (appliedFilters?.department && appliedFilters.department.length > 0) {
    const selectedDepts = departments.filter((d) => appliedFilters.department!.includes(d.name));
    if (selectedDepts.length > 0) {
      const el = selectedDepts.reduce((sum, d) => sum + d.eligibleStudents, 0);
      const pl = selectedDepts.reduce((sum, d) => sum + d.studentsPlaced, 0);
      const off = selectedDepts.reduce((sum, d) => sum + d.offers, 0);
      const rateStr = el > 0 ? ((pl / el) * 100).toFixed(1) + "%" : "0%";
      const avgNums = selectedDepts.map((d) => parseFloat(d.avgPackage.replace(/[^\d.]/g, "")));
      const avg = avgNums.reduce((sum, n) => sum + n, 0) / avgNums.length;

      displayStats = stats.map((stat) => {
        if (stat.title === "Eligible Students") return { ...stat, value: el.toString() };
        if (stat.title === "Students Placed") return { ...stat, value: pl.toString() };
        if (stat.title === "Placement Rate") return { ...stat, value: rateStr };
        if (stat.title === "Companies Visited") return { ...stat, title: "Offers", value: off.toString() };
        if (stat.title === "Average Package") return { ...stat, value: `₹${avg.toFixed(1)} LPA` };
        return stat;
      }) as typeof stats;
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0,1fr))",
        gap: 20,
        marginBottom: 24,
      }}
    >
      {displayStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)")}
          >
            {/* Icon Container */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: stat.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Icon size={18} color={stat.iconColor} />
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 4,
              }}
            >
              {stat.title}
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              {stat.value}
            </div>

            {/* Change */}
            <div
              style={{
                fontSize: 12,
                color: "#22c55e",
                marginTop: 4,
              }}
            >
              {(stat as any).change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
