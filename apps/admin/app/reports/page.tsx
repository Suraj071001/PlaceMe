"use client";

import { reports } from "../components/data";
import ReportCard from "./components/ReportCard";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter((report) => report.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-7 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold">Reports</h1>
        <p className="text-sm text-slate-500">Generate and download placement reports</p>
      </div>

      {/* Search */}
      <div className="relative max-w-[320px]">
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
