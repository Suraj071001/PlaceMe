"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { AddCompanyDialog } from "./components/AddCompanyDialog";
import { CompanyFilters } from "./components/CompanyFilters";
import { CompanyTable } from "./components/CompanyTable";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <Building2 className="w-6 h-6 text-indigo-600" />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-slate-800">Company Management</h1>
            <p className="text-sm text-slate-500">Manage recruiters, company history and placement drives</p>
          </div>
        </div>

        <AddCompanyDialog />
      </div>

      {/* Filters Section */}
      <section>
        <CompanyFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </section>

      {/* Table Section */}
      <section>
        <CompanyTable searchQuery={searchQuery} statusFilter={statusFilter} />
      </section>
    </div>
  );
}
