"use client";

import { useState } from "react";
import { Trash2, Settings2 } from "lucide-react";

type Company = {
  id: number;
  name: string;
  industry: string;
  tier: string;
  handler: string;
  facultyCoordinator: string;
  branch: string;
  lastVisit: string;
  lastYearCTC: string;
  lastYearPlaced: number;
  status: string;
};

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "Google",
    industry: "Technology",
    tier: "Tier 1",
    handler: "Rahul Gupta",
    facultyCoordinator: "Dr Sharma",
    branch: "CSE",
    lastVisit: "2024",
    lastYearCTC: "18 LPA",
    lastYearPlaced: 6,
    status: "Contacted",
  },
  {
    id: 2,
    name: "Amazon",
    industry: "Technology",
    tier: "Tier 1",
    handler: "Neha Singh",
    facultyCoordinator: "Dr Patel",
    branch: "MCA",
    lastVisit: "2023",
    lastYearCTC: "16 LPA",
    lastYearPlaced: 5,
    status: "Confirmed",
  },
  {
    id: 3,
    name: "TCS",
    industry: "IT Services",
    tier: "Tier 2",
    handler: "Prof. Kumar",
    facultyCoordinator: "Dr Das",
    branch: "IT",
    lastVisit: "2024",
    lastYearCTC: "7 LPA",
    lastYearPlaced: 12,
    status: "Prospect",
  },
];

interface CompanyTableProps {
  searchQuery: string;
  statusFilter: string;
  tierFilter: string;
}

const statusStyles: Record<string, string> = {
  Prospect: "bg-slate-100 text-slate-700",
  Contacted: "bg-blue-50 text-blue-600",
  Confirmed: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

const allColumns = ["industry", "tier", "handler", "facultyCoordinator", "branch", "lastVisit", "lastYearCTC", "lastYearPlaced", "status"];

export function CompanyTable({ searchQuery, statusFilter, tierFilter }: CompanyTableProps) {
  const [companies, setCompanies] = useState(initialCompanies);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(["industry", "tier", "handler", "lastVisit", "status"]);

  const [showMenu, setShowMenu] = useState(false);

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => (prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]));
  };

  const handleDelete = (id: number) => {
    const confirmDelete = confirm("Delete this company?");
    if (!confirmDelete) return;

    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = companies.filter((c) => {
    const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter === "all" || c.status === statusFilter;

    const tierMatch = tierFilter === "all" || c.tier === tierFilter;

    return searchMatch && statusMatch && tierMatch;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Column Selector */}
      <div className="relative flex justify-end border-b border-slate-100 p-3">
        <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <Settings2 className="w-4 h-4" />
          Columns
        </button>

        {showMenu && (
          <div className="absolute right-3 top-10 bg-white border border-slate-200 rounded-lg shadow-md p-3 w-52 z-10">
            {allColumns.map((col) => (
              <label key={col} className="flex items-center gap-2 text-sm py-1 capitalize">
                <input type="checkbox" checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} />
                {col.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          {/* Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-5 py-3 font-medium">Company</th>

              {visibleColumns.includes("industry") && <th className="px-5 py-3">Industry</th>}
              {visibleColumns.includes("tier") && <th className="px-5 py-3">Tier</th>}
              {visibleColumns.includes("handler") && <th className="px-5 py-3">Handler</th>}
              {visibleColumns.includes("facultyCoordinator") && <th className="px-5 py-3">Faculty Coordinator</th>}
              {visibleColumns.includes("branch") && <th className="px-5 py-3">Branch</th>}
              {visibleColumns.includes("lastVisit") && <th className="px-5 py-3">Last Visit</th>}
              {visibleColumns.includes("lastYearCTC") && <th className="px-5 py-3">Last Year CTC</th>}
              {visibleColumns.includes("lastYearPlaced") && <th className="px-5 py-3">Placed Students</th>}
              {visibleColumns.includes("status") && <th className="px-5 py-3">Status</th>}

              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-800">{c.name}</td>

                {visibleColumns.includes("industry") && <td className="px-5 py-4 text-slate-600">{c.industry}</td>}
                {visibleColumns.includes("tier") && <td className="px-5 py-4 text-slate-600">{c.tier}</td>}
                {visibleColumns.includes("handler") && <td className="px-5 py-4 text-slate-600">{c.handler}</td>}
                {visibleColumns.includes("facultyCoordinator") && <td className="px-5 py-4 text-slate-600">{c.facultyCoordinator}</td>}
                {visibleColumns.includes("branch") && <td className="px-5 py-4 text-slate-600">{c.branch}</td>}
                {visibleColumns.includes("lastVisit") && <td className="px-5 py-4 text-slate-600">{c.lastVisit}</td>}
                {visibleColumns.includes("lastYearCTC") && <td className="px-5 py-4 text-slate-600">{c.lastYearCTC}</td>}
                {visibleColumns.includes("lastYearPlaced") && <td className="px-5 py-4 text-slate-600">{c.lastYearPlaced}</td>}

                {visibleColumns.includes("status") && (
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[c.status]}`}>{c.status}</span>
                  </td>
                )}

                {/* Delete Action */}
                <td className="px-5 py-4 text-center">
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
