"use client";

import { useEffect, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { tabs, type Department } from "./data";
import { DepartmentBarChart } from "./DepartmentBarChart";
import { DepartmentPieChart } from "./DepartmentPiChart";
import { getFilteredDepartmentData } from "./analyticsFilters";

export function DepartmentChart({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [activeTab, setActiveTab] = useState("overall");
  const [isMobile, setIsMobile] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/analytics/departments");
        const json = await res.json();
        if (json.success && json.data) {
          setDepartments(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const parseLpa = (value: string) => {
    const n = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const filteredByDropdown = getFilteredDepartmentData(departments, appliedFilters);
  const filteredDepartments =
    activeTab === "overall" ? filteredByDropdown : filteredByDropdown.filter((dept) => dept.name.toLowerCase().replace(/\s/g, "") === activeTab);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const getLegendName = (value: string | number) => {
    const name = String(value);
    if (!isMobile) return name;

    if (name === "Avg Package (LPA)") return "Avg (LPA)";
    if (name === "Highest Package (LPA)") return "Highest (LPA)";
    return name;
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: isMobile ? 14 : 24,
        margin: isMobile ? "0 0 16px" : "0 24px 24px",
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
          marginBottom: isMobile ? 16 : 24,
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
                padding: isMobile ? "6px 10px" : "6px 14px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                fontSize: isMobile ? 12 : 13,
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
          <div style={{ width: "100%", height: isMobile ? 420 : 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={overallData} margin={{ top: 8, right: isMobile ? 8 : 18, bottom: isMobile ? 34 : 0, left: isMobile ? 0 : 10 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} interval={0} angle={isMobile ? -28 : -10} height={isMobile ? 76 : 50} />
                <YAxis yAxisId="count" tick={{ fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="lpa" orientation="right" tick={{ fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false} />
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
                <Legend
                  iconSize={isMobile ? 10 : 12}
                  wrapperStyle={{
                    paddingTop: 8,
                  }}
                  formatter={(value) => getLegendName(value)}
                />

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
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 20,
                marginTop: isMobile ? 8 : 20,
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
