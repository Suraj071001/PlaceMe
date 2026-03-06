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
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "32px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Stats Cards */}
      <StatsCards appliedFilters={appliedFilters} />

      {/* Filter Analytics */}
      <FilterAnalytics
        filters={filters}
        appliedFilters={appliedFilters}
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

          {/* Performance Summary + Recent Activity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 17, padding: "0 24px", marginBottom: 20, alignItems: "stretch" }}>
            <PerformanceSummary appliedFilters={appliedFilters} />
            <RecentActivity appliedFilters={appliedFilters} />
          </div>

          {/* Upcoming Events */}
          <div style={{ padding: "0 24px", marginBottom: 24 }}>
            <UpcomingEvents />
          </div>
        </>
      )}
    </div>
  );
}
