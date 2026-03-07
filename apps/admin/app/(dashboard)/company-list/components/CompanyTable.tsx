"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type Company = {
  id: number;
  name: string;
  industry: string;
  handler: string;
  facultyCoordinator: string;
  branch: string;
  status: string;
};

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "Google",
    industry: "Technology",
    handler: "Rahul Gupta",
    facultyCoordinator: "Dr Sharma",
    branch: "CSE",
    status: "Contacted",
  },
  {
    id: 2,
    name: "Amazon",
    industry: "Technology",
    handler: "Neha Singh",
    facultyCoordinator: "Dr Patel",
    branch: "MCA",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "TCS",
    industry: "IT Services",
    handler: "Prof. Kumar",
    facultyCoordinator: "Dr Das",
    branch: "IT",
    status: "Prospect",
  },
];

interface CompanyTableProps {
  searchQuery: string;
  statusFilter: string;
}

const statusStyles: Record<string, string> = {
  Prospect: "bg-slate-100 text-slate-700",
  Contacted: "bg-blue-50 text-blue-600",
  Confirmed: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

export function CompanyTable({ searchQuery, statusFilter }: CompanyTableProps) {
  const [companies, setCompanies] = useState(initialCompanies);

  const handleDelete = (id: number) => {
    const confirmDelete = confirm("Delete this company?");
    if (!confirmDelete) return;

    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = companies.filter((c) => {
    const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter === "all" || c.status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          {/* Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3">Industry</th>
              <th className="px-5 py-3">Handler</th>
              <th className="px-5 py-3">Faculty Coordinator</th>
              <th className="px-5 py-3">Branch</th>
              <th className="px-5 py-3">Status</th>

              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-800">{c.name}</td>
                <td className="px-5 py-4 text-slate-600">{c.industry}</td>
                <td className="px-5 py-4 text-slate-600">{c.handler}</td>
                <td className="px-5 py-4 text-slate-600">{c.facultyCoordinator}</td>
                <td className="px-5 py-4 text-slate-600">{c.branch}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[c.status]}`}>{c.status}</span>
                </td>

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
