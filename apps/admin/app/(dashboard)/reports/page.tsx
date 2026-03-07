"use client";

import { reports } from "../../components/data";
import ReportCard from "./components/ReportCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { API_BASE } from "../../lib/api";

type ReportItem = {
  id: number;
  title: string;
  description: string;
  generatedAt: string;
  type: "Placement" | "Department" | "Company";
  file: string;
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [reportsData, setReportsData] = useState<ReportItem[]>(reports as ReportItem[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/reports`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch reports: ${res.status}`);
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReportsData(json.data as ReportItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reportsData.filter((report) => report.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div>
        <h1 className="text-[22px] font-semibold">Reports</h1>
        <p className="text-sm text-slate-500">Generate and download placement reports</p>
      </div>

      <div className="relative w-full max-w-[320px]">
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="text-slate-500 text-sm py-4">Loading reports...</div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} apiBase={API_BASE} />
          ))
        ) : (
          <div className="text-slate-500 text-sm py-4">No reports found matching your search.</div>
        )}
      </div>
    </div>
  );
}
