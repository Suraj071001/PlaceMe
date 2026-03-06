"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { AddCompanyDialog } from "./components/AddCompanyDialog";
import { CompanyFilters } from "./components/CompanyFilters";
import { CompanyTable } from "./components/CompanyTable";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        <CompanyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tierFilter={tierFilter}
          setTierFilter={setTierFilter}
        />
      </section>

      {/* Table Section */}
      <section>
        <CompanyTable searchQuery={searchQuery} statusFilter={statusFilter} tierFilter={tierFilter} />
      </section>
    </div>
  );
}
