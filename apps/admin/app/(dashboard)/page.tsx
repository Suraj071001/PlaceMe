"use client";

import { useState } from "react";
import { StatsCards } from "../components/StatsCards";
import { FilterAnalytics } from "../components/FilterAnalytics";
import { EmptyAnalytics } from "../components/EmptyAnalytics";
import { ViewToggle } from "../components/ViewToggle";
import { DepartmentChart } from "../components/DepartmentChart";
import { DepartmentTable } from "../components/DepartmentTable";
import { PerformanceSummary } from "../components/PerformanceSummary";
import { RecentActivity } from "../components/RecentActivity";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { FilterKeys } from "../components/data";

export default function Page() {
  const [filters, setFilters] = useState<Record<FilterKeys, string[]>>({
    dateRange: [],
    department: [],
    jobType: [],
    placementTier: [],
    compareYears: [],
  });
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [activeView, setActiveView] = useState<"graphical" | "table">("graphical");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleFilterChange = (key: FilterKeys, value: string) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      if (key === "dateRange" || key === "compareYears") return { ...prev, [key]: [value] };
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleApplyFilters = () => {
    const active: Record<string, string[]> = {};
    (Object.keys(filters) as FilterKeys[]).forEach((key) => {
      if (filters[key].length > 0) {
        active[key] = filters[key];
      }
    });
    setAppliedFilters(active);
    setFiltersApplied(Object.keys(active).length > 0);
  };

  const handleClearAll = () => {
    setFilters({
      dateRange: [],
      department: [],
      jobType: [],
      placementTier: [],
      compareYears: [],
    });
    setAppliedFilters({});
    setFiltersApplied(false);
  };

  const handleRemoveFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as FilterKeys].filter((v) => v !== value),
    }));
    setAppliedFilters((prev) => {
      const next = { ...prev };
      if (next[key]) {
        next[key] = next[key].filter((v) => v !== value);
        if (next[key].length === 0) delete next[key];
      }
      if (Object.keys(next).length === 0) setFiltersApplied(false);
      return next;
    });
  };

  return (
    <div className="mx-auto min-h-full w-full max-w-[1400px] bg-[#f5f7fb] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      {/* Stats Cards */}
      <StatsCards appliedFilters={appliedFilters} />

      {/* Filter Analytics */}
      <FilterAnalytics
        filters={filters}
        appliedFilters={appliedFilters}
        showGenerateReport={filtersApplied}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClearAll={handleClearAll}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Analytics Content */}
      {!filtersApplied ? (
        <EmptyAnalytics />
      ) : (
        <>
          {/* View Toggle */}
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />

          {/* Chart or Table */}
          {activeView === "graphical" ? <DepartmentChart appliedFilters={appliedFilters} /> : <DepartmentTable appliedFilters={appliedFilters} />}

          {/* Performance Summary */}
          <div className="mb-5 px-0 md:px-4">
            <PerformanceSummary appliedFilters={appliedFilters} />
          </div>
        </>
      )}

      {/* Always visible widgets */}
      <div className="mb-5 grid grid-cols-1 items-stretch gap-4 px-0 md:px-4">
        <RecentActivity appliedFilters={appliedFilters} />
      </div>

      <div className="mb-6 px-0 md:px-4">
        <UpcomingEvents />
      </div>
    </div>
  );
}
