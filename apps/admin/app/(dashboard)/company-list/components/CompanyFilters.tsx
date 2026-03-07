import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";

interface CompanyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function CompanyFilters({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }: CompanyFiltersProps) {
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
        <option value="Prospect">Prospect</option>
        <option value="Contacted">Contacted</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}
