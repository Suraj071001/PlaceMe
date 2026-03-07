import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";

type BranchOption = {
  id: string;
  name: string;
};

interface CompanyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  statusOptions: string[];
  branchFilter: string;
  setBranchFilter: (branch: string) => void;
  branchOptions: BranchOption[];
}

export function CompanyFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions,
  branchFilter,
  setBranchFilter,
  branchOptions,
}: CompanyFiltersProps) {
  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="h-9 w-full px-3 border border-slate-200 rounded-lg text-sm sm:w-auto"
      >
        <option value="all">All Status</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>

      <select
        value={branchFilter}
        onChange={(e) => setBranchFilter(e.target.value)}
        className="h-9 w-full px-3 border border-slate-200 rounded-lg text-sm sm:w-auto"
      >
        <option value="all">All Branches</option>
        {branchOptions.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}
