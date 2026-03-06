import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";

interface CompanyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  tierFilter: string;
  setTierFilter: (tier: string) => void;
}

export function CompanyFilters({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, tierFilter, setTierFilter }: CompanyFiltersProps) {
  return (
    <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm">
        <option value="all">All Status</option>
        <option value="Prospect">Prospect</option>
        <option value="Contacted">Contacted</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm">
        <option value="all">All Tiers</option>
        <option value="Tier 1">Tier 1</option>
        <option value="Tier 2">Tier 2</option>
        <option value="Tier 3">Tier 3</option>
      </select>
    </div>
  );
}
