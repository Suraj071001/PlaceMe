"use client";

import { useState } from "react";
import { type Department } from "./data";
import { getFilteredDepartmentData } from "./analyticsFilters";

const allColumns = [
  { key: "placements", label: "Placements" },
  { key: "internships", label: "Internships" },
  { key: "offers", label: "Offers" },
  { key: "avgPackage", label: "Avg Package" },
  { key: "rate", label: "Placement Rate" },
  { key: "highestPackage", label: "Highest Package" },
  { key: "eligibleStudents", label: "Eligible Students" },
  { key: "studentsPlaced", label: "Students Placed" },
];

export function DepartmentTable({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["placements", "offers", "avgPackage"]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  const parseLpa = (value: unknown) => {
    if (typeof value !== "string") return 0;
    const n = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const filteredDepartments = getFilteredDepartmentData(appliedFilters);

  const totals = filteredDepartments.reduce(
    (acc, d: Department) => {
      acc.placements += d.placements;
      acc.internships += d.internships;
      acc.offers += d.offers;
      acc.eligibleStudents += d.eligibleStudents;
      acc.studentsPlaced += d.studentsPlaced;
      acc.avgLpaSum += parseLpa(d.avgPackage);
      acc.highestLpaMax = Math.max(acc.highestLpaMax, parseLpa(d.highestPackage));
      acc.count += 1;
      return acc;
    },
    { placements: 0, internships: 0, offers: 0, eligibleStudents: 0, studentsPlaced: 0, avgLpaSum: 0, highestLpaMax: 0, count: 0 },
  );

  const avgLpaOverall = totals.count > 0 ? totals.avgLpaSum / totals.count : 0;
  const rateOverall = totals.eligibleStudents > 0 ? Math.round((totals.studentsPlaced / totals.eligibleStudents) * 100) : 0;

  const orderedSelectedColumns = allColumns.map((c) => c.key).filter((k) => selectedColumns.includes(k));

  const cellAlign = (key: string): "left" | "center" | "right" => {
    if (key === "avgPackage" || key === "highestPackage") return "right";
    if (key === "rate") return "center";
    return "center";
  };

  const renderValue = (dept: Department, key: string) => {
    switch (key) {
      case "placements":
        return dept.placements;
      case "internships":
        return dept.internships;
      case "offers":
        return dept.offers;
      case "avgPackage":
        return dept.avgPackage;
      case "highestPackage":
        return dept.highestPackage;
      case "eligibleStudents":
        return dept.eligibleStudents;
      case "studentsPlaced":
        return dept.studentsPlaced;
      case "rate":
        return dept.rate;
      default:
        return "-";
    }
  };

  const renderTotal = (key: string) => {
    switch (key) {
      case "placements":
        return totals.placements;
      case "internships":
        return totals.internships;
      case "offers":
        return totals.offers;
      case "eligibleStudents":
        return totals.eligibleStudents;
      case "studentsPlaced":
        return totals.studentsPlaced;
      case "avgPackage":
        return `₹${avgLpaOverall.toFixed(1)} LPA`;
      case "highestPackage":
        return `₹${totals.highestLpaMax.toFixed(0)} LPA`;
      case "rate":
        return `${rateOverall}%`;
      default:
        return "-";
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16, margin: "0 0 24px" }} className="sm:p-6 md:mx-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: "0 0 4px" }}>Department-wise Performance Data</h3>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Comprehensive department statistics - customize visible columns</p>
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            style={{
              background: "none",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⚙️ Columns
          </button>
          {showColumnSelector && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 4,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                padding: 12,
                minWidth: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Select Columns to Display</div>
              {allColumns.map((col) => (
                <label key={col.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    style={{ accentColor: "#6366f1" }}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              <th style={{ textAlign: "left", padding: "12px 8px", fontSize: 13, color: "#64748b", fontWeight: 600 }}>Department</th>
              {orderedSelectedColumns.map((key) => {
                const col = allColumns.find((c) => c.key === key)!;
                return (
                  <th
                    key={key}
                    style={{
                      textAlign: cellAlign(key),
                      padding: "12px 8px",
                      fontSize: 13,
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.name} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 8px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{dept.name}</td>
                {orderedSelectedColumns.map((key) => (
                  <td
                    key={key}
                    style={{
                      textAlign: cellAlign(key),
                      padding: "14px 8px",
                      fontSize: 14,
                      color: key === "placements" ? "#6366f1" : key === "internships" ? "#22c55e" : "#334155",
                      fontWeight: key === "placements" || key === "internships" ? 600 : 500,
                    }}
                  >
                    {renderValue(dept as Department, key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: "2px solid #e2e8f0" }}>
              <td style={{ padding: "14px 8px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Total</td>
              {orderedSelectedColumns.map((key) => (
                <td
                  key={key}
                  style={{
                    textAlign: cellAlign(key),
                    padding: "14px 8px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: key === "placements" ? "#6366f1" : key === "internships" ? "#22c55e" : "#1e293b",
                  }}
                >
                  {renderTotal(key)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
