"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { useState } from "react";

const reportTypes = [
  { value: "placement-summary", label: "Placement Summary" },
  { value: "department-analysis", label: "Department Analysis" },
  { value: "company-report", label: "Company Report" },
  { value: "internship-report", label: "Internship Report" },
];

export default function GenerateReportDialog({ open, setOpen }: any) {
  const [reportType, setReportType] = useState("");
  const [department, setDepartment] = useState("all");
  const [jobType, setJobType] = useState("placement");
  const [tier, setTier] = useState("all");
  const [dateRange, setDateRange] = useState("");

  async function generateReport() {
    const payload = {
      reportType,
      filters: {
        department,
        jobType,
        tier,
        dateRange,
      },
    };

    console.log("Generating report with:", payload);

    await fetch("/api/reports/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Report Type */}
          <div>
            <label className="text-sm font-medium">Report Type</label>

            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1 text-sm">
              <option value="">Select report type</option>

              {reportTypes.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-sm font-medium">Department</label>

            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1 text-sm">
              <option value="all">All Departments</option>
              <option value="cse">CSE</option>
              <option value="ece">ECE</option>
              <option value="mechanical">Mechanical</option>
              <option value="civil">Civil</option>
              <option value="mca">MCA</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="text-sm font-medium">Job Type</label>

            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1 text-sm">
              <option value="placement">Placement</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Tier */}
          <div>
            <label className="text-sm font-medium">Tier</label>

            <select value={tier} onChange={(e) => setTier(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1 text-sm">
              <option value="all">All</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="dream">Dream</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium">Date Range</label>

            <input type="date" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1 text-sm" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded-md text-sm hover:bg-slate-50">
              Cancel
            </button>

            <button onClick={generateReport} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
