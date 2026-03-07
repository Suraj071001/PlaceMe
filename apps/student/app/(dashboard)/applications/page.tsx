"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, Filter, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { ApplicationStatusCard } from "./application-status-card";
import { ApplicationColumn } from "./application-column";
import { ApplicationListView } from "./application-list-view";
import { ApplicationFilterBar, defaultFilters, type ApplicationFilters } from "./application-filter-bar";
import type { Application } from "./application-card";

const DEFAULT_STATUSES = ["Applied", "Online Assessment", "Technical Interview", "HR Interview", "Selected", "Rejected"] as const;

const API_BASE = typeof window !== "undefined" ? "http://localhost:5501/api/v1" : "";

type BackendApplication = {
  id: string;
  status?: string;
  createdAt?: string;
  stage?: {
    name?: string;
  } | null;
  job?: {
    title?: string | null;
    role?: string | null;
    ctc?: string | null;
    location?: string | null;
    employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP" | null;
    tier?: "BASIC" | "STANDARD" | "DREAM" | null;
    company?: {
      name?: string | null;
    } | null;
  } | null;
};

const getTrackingStatus = (status?: string, stageName?: string | null) => {
  if (stageName && stageName.trim()) return stageName.trim();
  switch (status) {
    case "DRAFT":
    case "APPLIED":
      return "Applied";
    case "SCREENING":
    case "PHONE_SCREEN":
      return "Online Assessment";
    case "INTERVIEW":
      return "Technical Interview";
    case "OFFER":
      return "HR Interview";
    case "HIRED":
      return "Selected";
    case "REJECTED":
    case "ARCHIVED":
      return "Rejected";
    default:
      return "Applied";
  }
};

const mapEmploymentType = (value?: BackendApplication["job"] extends infer T ? (T extends { employmentType?: infer U } ? U : never) : never) => {
  if (value === "INTERNSHIP") return "Internship" as const;
  return "Full-time" as const;
};

const mapTier = (value?: BackendApplication["job"] extends infer T ? (T extends { tier?: infer U } ? U : never) : never) => {
  if (value === "DREAM") return "Dream" as const;
  if (value === "STANDARD") return "Tier 1" as const;
  return "Tier 2" as const;
};

const parsePackage = (ctc?: string | null) => {
  if (!ctc) return 0;
  const match = ctc.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const mapBackendToUi = (application: BackendApplication): Application => ({
  id: application.id,
  company: application.job?.company?.name ?? "Unknown Company",
  role: application.job?.title || application.job?.role || "Untitled Role",
  type: mapEmploymentType(application.job?.employmentType),
  tier: mapTier(application.job?.tier),
  package: parsePackage(application.job?.ctc),
  location: application.job?.location || "N/A",
  appliedDate: formatDate(application.createdAt),
  status: getTrackingStatus(application.status, application.stage?.name),
});

export default function ApplicationsPage() {
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");

    const loadApplications = async () => {
      if (!token) {
        if (mounted) {
          setApplications([]);
          setError("Please log in to view applications.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.jobType) params.set("jobType", filters.jobType);
        if (filters.status) params.set("status", filters.status);
        if (filters.tier) params.set("tier", filters.tier);
        if (filters.location) params.set("location", filters.location);
        if (filters.minPackage) params.set("minPackage", filters.minPackage);
        if (filters.maxPackage) params.set("maxPackage", filters.maxPackage);
        if (filters.appliedFrom) params.set("appliedFrom", filters.appliedFrom);
        if (filters.appliedTo) params.set("appliedTo", filters.appliedTo);

        const response = await fetch(`${API_BASE}/student-application/mine?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message ?? payload?.error ?? "Failed to fetch applications");
        }

        const data: BackendApplication[] = Array.isArray(payload?.data) ? payload.data : [];
        if (mounted) {
          setApplications(data.map(mapBackendToUi));
        }
      } catch (fetchError) {
        if (mounted) {
          setApplications([]);
          setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch applications");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      void loadApplications();
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [filters]);

  const locations = useMemo(() => [...new Set(applications.map((a) => a.location))], [applications]);

  const statuses = useMemo(() => {
    const dynamic = Array.from(new Set(applications.map((a) => a.status))).filter(Boolean);
    const merged = [...DEFAULT_STATUSES];
    dynamic.forEach((status) => {
      if (!merged.includes(status as (typeof DEFAULT_STATUSES)[number])) {
        merged.push(status as (typeof DEFAULT_STATUSES)[number]);
      }
    });
    return merged;
  }, [applications]);

  const grouped = useMemo(() => {
    const map: Record<string, Application[]> = {};
    for (const status of statuses) {
      map[status] = [];
    }
    for (const app of applications) {
      const bucket = map[app.status];
      if (bucket) {
        bucket.push(app);
      }
    }
    return map;
  }, [applications, statuses]);

  return (
    <div className="min-w-0 space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Tracking</h1>
          <p className="text-muted-foreground">Track your application status and progress</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pipeline / List toggle */}
          <div className="flex overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => setView("pipeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "pipeline" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Pipeline
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 border-l px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>

          {/* Filters toggle */}
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`gap-1.5 ${filtersOpen ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {filtersOpen && <ChevronUp className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <ApplicationFilterBar filters={filters} onFilterChange={setFilters} isOpen={filtersOpen} statuses={statuses} locations={locations} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Summary bar */}
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <ApplicationStatusCard key={status} count={grouped[status]?.length ?? 0} label={status} />
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading applications...</div>
      ) : view === "pipeline" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statuses.map((status) => (
            <ApplicationColumn key={status} status={status} applications={grouped[status] ?? []} />
          ))}
        </div>
      ) : (
        <ApplicationListView applications={applications} />
      )}
    </div>
  );
}
