"use client";

import { Funnel, BarChart3, FileText } from "lucide-react";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { useState } from "react";
import GenerateReportDialog from "./GenerateReportDialog";
import { FilterKeys, filterOptions } from "./data";

const defaultFilterValues: Record<FilterKeys, string> = {
  dateRange: "Select Range",
  department: "All Departments",
  jobType: "All Types",
  placementTier: "Select Tier",
  compareYears: "Select Year",
};

const filterLabels: Record<FilterKeys, string> = {
  dateRange: "Date Range",
  department: "Department",
  jobType: "Job Type",
  placementTier: "Placement Tier",
  compareYears: "Year",
};

interface FilterAnalyticsProps {
  filters: Record<FilterKeys, string[]>;
  appliedFilters: Record<string, string[]>;
  showGenerateReport: boolean;
  onFilterChange: (key: FilterKeys, value: string) => void;
  onApply: () => void;
  onClearAll: () => void;
  onRemoveFilter: (key: string, value: string) => void;
}

export function FilterAnalytics({ filters, appliedFilters, showGenerateReport, onFilterChange, onApply, onClearAll, onRemoveFilter }: FilterAnalyticsProps) {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="m-0 flex items-center gap-2 text-base font-semibold text-slate-800">
          <Funnel size={16} color="#6366f1" /> Filter Analytics Data
        </h3>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {showGenerateReport && (
            <button
              onClick={() => setOpenReportDialog(true)}
              disabled={Object.keys(appliedFilters).length === 0}
              className="flex items-center gap-2 rounded-lg bg-indigo-100 px-3.5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FileText size={16} />
              Generate Report
            </button>
          )}
          {Object.keys(appliedFilters).length > 0 && (
            <button onClick={onClearAll} className="flex items-center gap-1 bg-transparent py-2 text-sm text-slate-500 transition-colors hover:text-slate-700">
              ✕ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Dropdowns */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {(Object.keys(filterOptions) as FilterKeys[]).map((key) => {
          const options = filterOptions[key].filter((opt) => opt !== defaultFilterValues[key]);
          return (
            <div key={key}>
              <MultiSelectDropdown
                label={filterLabels[key]}
                options={options}
                selectedValues={filters[key]}
                onChange={(val) => onFilterChange(key, val)}
                placeholder={defaultFilterValues[key]}
              />
            </div>
          );
        })}
      </div>

      {/* Active filter tags */}
      {Object.keys(appliedFilters).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="self-center text-[13px] text-slate-500">Active Filters:</span>
          {Object.entries(appliedFilters).flatMap(([key, values]) =>
            values.map((value) => (
              <span key={`${key}-${value}`} className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-indigo-600">
                {key}: {value}
                <button onClick={() => onRemoveFilter(key, value)} className="cursor-pointer border-0 bg-transparent p-0 text-sm text-indigo-600">
                  ×
                </button>
              </span>
            )),
          )}
        </div>
      )}

      {/* Apply button */}
      <button
        onClick={onApply}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <BarChart3 size={16} /> Apply Filters & View Analytics
      </button>
      <GenerateReportDialog open={openReportDialog} setOpen={setOpenReportDialog} filters={appliedFilters} />
    </div>
  );
}
