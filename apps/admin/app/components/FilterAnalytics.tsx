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
  placementTier: "All Tiers",
  compareYears: "No Comparison",
};

const filterLabels: Record<FilterKeys, string> = {
  dateRange: "Date Range",
  department: "Department",
  jobType: "Job Type",
  placementTier: "Placement Tier",
  compareYears: "Compare Years",
};

interface FilterAnalyticsProps {
  filters: Record<FilterKeys, string[]>;
  appliedFilters: Record<string, string[]>;
  onFilterChange: (key: FilterKeys, value: string) => void;
  onApply: () => void;
  onClearAll: () => void;
  onRemoveFilter: (key: string, value: string) => void;
}

export function FilterAnalytics({ filters, appliedFilters, onFilterChange, onApply, onClearAll, onRemoveFilter }: FilterAnalyticsProps) {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, margin: "0 2px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Funnel size={16} color="#6366f1" /> Filter Analytics Data
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setOpenReportDialog(true)}
            disabled={Object.keys(appliedFilters).length === 0}
            style={{
              background: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#4338ca",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(67, 56, 202, 0.15)",
            }}
          >
            <FileText size={16} />
            Generate Report
          </button>
          {Object.keys(appliedFilters).length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "10px 0",
              }}
            >
              ✕ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Dropdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 16 }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#64748b", alignSelf: "center" }}>Active Filters:</span>
          {Object.entries(appliedFilters).flatMap(([key, values]) =>
            values.map((value) => (
              <span
                key={`${key}-${value}`}
                style={{
                  background: "#ede9fe",
                  color: "#6366f1",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {key}: {value}
                <button
                  onClick={() => onRemoveFilter(key, value)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6366f1",
                    fontSize: 14,
                    padding: 0,
                  }}
                >
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
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <BarChart3 size={16} /> Apply Filters & View Analytics
      </button>
      <GenerateReportDialog open={openReportDialog} setOpen={setOpenReportDialog} filters={appliedFilters} />
    </div>
  );
}
