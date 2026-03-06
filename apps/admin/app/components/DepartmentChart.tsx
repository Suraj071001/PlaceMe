"use client";

import { useEffect, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { tabs, type Department } from "./data";
import { DepartmentBarChart } from "./DepartmentBarChart";
import { DepartmentPieChart } from "./DepartmentPiChart";
import { getFilteredDepartmentData } from "./analyticsFilters";

export function DepartmentChart({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [activeTab, setActiveTab] = useState("overall");

  const parseLpa = (value: string) => {
    const n = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const filteredByDropdown = getFilteredDepartmentData(appliedFilters);
  const filteredDepartments =
    activeTab === "overall" ? filteredByDropdown : filteredByDropdown.filter((dept) => dept.name.toLowerCase().replace(/\s/g, "") === activeTab);

  useEffect(() => {
    if (activeTab === "overall") {
      return;
    }

    const tabStillExists = filteredByDropdown.some((dept) => dept.name.toLowerCase().replace(/\s/g, "") === activeTab);
    if (!tabStillExists) {
      setActiveTab("overall");
    }
  }, [activeTab, filteredByDropdown]);

  const overallData = filteredByDropdown.map((d: Department) => ({
    name: d.name,
    placements: d.placements,
    internships: d.internships,
    offers: d.offers,
    avgLpa: Number(parseLpa(d.avgPackage).toFixed(1)),
    highestLpa: Number(parseLpa(d.highestPackage).toFixed(1)),
    eligible: d.eligibleStudents,
    placed: d.studentsPlaced,
  }));

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: 24,
        margin: "0 24px 24px",
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#1e293b",
          margin: "0 0 4px",
        }}
      >
        Department-wise Performance
      </h3>

      <p
        style={{
          fontSize: 13,
          color: "#94a3b8",
          margin: "0 0 24px",
        }}
      >
        Placements, Internships, and average packages by department
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                fontSize: 13,
                background: activeTab === tab.key ? "#6366f1" : "#fff",
                color: activeTab === tab.key ? "#fff" : "#334155",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          transition: "all 0.3s ease",
        }}
      >
        {/* Chart */}
        {activeTab === "overall" ? (
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={overallData} margin={{ top: 8, right: 18, bottom: 0, left: 10 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} height={50} />
                <YAxis yAxisId="count" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="lpa" orientation="right" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number | string | undefined, name: string | number | undefined, _props: unknown) => {
                    if (name === "avgLpa") return [`${value} LPA`, "Avg Package"];
                    if (name === "highestLpa") return [`${value} LPA`, "Highest Package"];
                    if (name === "offers") return [value ?? 0, "Offers"];
                    if (name === "placements") return [value ?? 0, "Placements"];
                    if (name === "internships") return [value ?? 0, "Internships"];
                    return [value ?? "", String(name ?? "")];
                  }}
                  labelFormatter={(label: unknown) => `Department: ${String(label ?? "")}`}
                />
                <Legend />

                <Bar yAxisId="count" dataKey="placements" name="Placements" fill="#818cf8" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="count" dataKey="internships" name="Internships" fill="#86efac" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="count" dataKey="offers" name="Offers" fill="#fb923c" radius={[6, 6, 0, 0]} />

                <Line
                  yAxisId="lpa"
                  type="monotone"
                  dataKey="avgLpa"
                  name="Avg Package (LPA)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="lpa"
                  type="monotone"
                  dataKey="highestLpa"
                  name="Highest Package (LPA)"
                  stroke="#0ea5e9"
                  strokeWidth={0}
                  dot={{ r: 4, fill: "#0ea5e9" }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div
              key={dept.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20,
              }}
            >
              <DepartmentBarChart dept={dept} />
              <DepartmentPieChart dept={dept} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
