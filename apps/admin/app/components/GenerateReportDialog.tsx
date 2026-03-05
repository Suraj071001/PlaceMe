"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { FileText } from "lucide-react";
import { useState } from "react";

const reportTypes = [
  { value: "placement-summary", label: "Placement Summary" },
  { value: "department-analysis", label: "Department Analysis" },
  { value: "company-report", label: "Company Hiring Report" },
  { value: "internship-report", label: "Internship Report" },
  { value: "tier-analysis", label: "Placement Tier Analysis" },
];

export default function GenerateReportDialog({ open, setOpen, filters }: any) {
  const [reportType, setReportType] = useState("placement-summary");

  function handleGenerate() {
    const payload = {
      reportType,
      filters,
    };

    console.log("Generating report:", payload);

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Report Type */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Report Type</label>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              {reportTypes.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filters Preview */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Filters Applied</label>

            <div
              style={{
                marginTop: 6,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: 10,
                background: "#f8fafc",
              }}
            >
              {Object.keys(filters).length === 0 ? (
                <p style={{ fontSize: 13, color: "#94a3b8" }}>No filters selected — report will include all data.</p>
              ) : (
                Object.entries(filters).map(([key, values]: any) => (
                  <div key={key} style={{ fontSize: 13 }}>
                    <strong>{key}</strong>: {values.join(", ")}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <FileText size={14} />
              Generate Report
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
