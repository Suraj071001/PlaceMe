"use client";

import { Trash2 } from "lucide-react";

export type Company = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  facultyCoordinator: string;
  branch: string;
  status: "CONTACTED" | "INTERESTED" | "NOT_INTERESTED" | "DRIVE_COMPLETED" | "OFFER_RELEASED" | "ON_HOLD" | "BLACKLISTED";
};

interface CompanyTableProps {
  companies: Company[];
  onDeleteCompany: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  CONTACTED: "bg-blue-50 text-blue-700",
  INTERESTED: "bg-indigo-50 text-indigo-700",
  NOT_INTERESTED: "bg-red-50 text-red-700",
  DRIVE_COMPLETED: "bg-green-50 text-green-700",
  OFFER_RELEASED: "bg-emerald-50 text-emerald-700",
  ON_HOLD: "bg-amber-50 text-amber-700",
  BLACKLISTED: "bg-slate-100 text-slate-700",
};

const formatStatus = (status: Company["status"]) =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function CompanyTable({ companies, onDeleteCompany }: CompanyTableProps) {
  const handleDelete = (id: string) => {
    const confirmDelete = confirm("Delete this company?");
    if (!confirmDelete) return;

    onDeleteCompany(id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          {/* Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Domain</th>
              <th className="px-5 py-3">Industry</th>
              <th className="px-5 py-3">Faculty Coordinator</th>
              <th className="px-5 py-3">Branch</th>
              <th className="px-5 py-3">Status</th>

              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-800">{c.name}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{c.domain}</td>
                <td className="px-5 py-4 text-slate-600">{c.industry}</td>
                <td className="px-5 py-4 text-slate-600">{c.facultyCoordinator}</td>
                <td className="px-5 py-4 text-slate-600">{c.branch}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[c.status]}`}>{formatStatus(c.status)}</span>
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
