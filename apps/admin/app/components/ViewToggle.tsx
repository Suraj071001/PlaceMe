"use client";

import { BarChart3, FileText } from "lucide-react";

interface ViewToggleProps {
  activeView: "graphical" | "table";
  onViewChange: (view: "graphical" | "table") => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "16px 24px",
        margin: "0 24px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 0 }}>
        <button
          onClick={() => onViewChange("graphical")}
          style={{
            padding: "8px 20px",
            borderRadius: "20px 0 0 20px",
            border: "1px solid #6366f1",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: activeView === "graphical" ? "#6366f1" : "#fff",
            color: activeView === "graphical" ? "#fff" : "#6366f1",
          }}
        >
          <BarChart3 size={14} /> Graphical View
        </button>
        <button
          onClick={() => onViewChange("table")}
          style={{
            padding: "8px 20px",
            borderRadius: "0 20px 20px 0",
            border: "1px solid #6366f1",
            borderLeft: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: activeView === "table" ? "#6366f1" : "#fff",
            color: activeView === "table" ? "#fff" : "#6366f1",
          }}
        >
          <FileText size={14} /> Table View
        </button>
      </div>
      <button
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ⬇ Export Data
      </button>
    </div>
  );
}
