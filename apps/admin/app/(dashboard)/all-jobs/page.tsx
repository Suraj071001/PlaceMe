"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../lib/api";

const ITEMS_PER_PAGE = 5;

type ApiJob = {
  id: string;
  title: string;
  role: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT" | "PAUSED" | "ARCHIVED";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";
  workMode: string;
  ctc: string | null;
  tier: "BASIC" | "STANDARD" | "DREAM";
  closeAt: string;
  company: { id: string; name: string };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const statusBadgeClass: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DRAFT: "bg-amber-100 text-amber-700",
  CLOSED: "bg-red-100 text-red-700",
  PAUSED: "bg-orange-100 text-orange-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

const ALL_FILTER_VALUE = "ALL";

const STATUS_ORDER: ApiJob["status"][] = ["ACTIVE", "DRAFT", "PAUSED", "CLOSED", "ARCHIVED"];
const EMPLOYMENT_TYPE_ORDER: ApiJob["employmentType"][] = ["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERNSHIP"];
const TIER_ORDER: ApiJob["tier"][] = ["BASIC", "STANDARD", "DREAM"];

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AllJobsPage() {
  const [statusFilter, setStatusFilter] = useState<typeof ALL_FILTER_VALUE | ApiJob["status"]>(ALL_FILTER_VALUE);
  const [typeFilter, setTypeFilter] = useState<typeof ALL_FILTER_VALUE | ApiJob["employmentType"]>(ALL_FILTER_VALUE);
  const [workModeFilter, setWorkModeFilter] = useState(ALL_FILTER_VALUE);
  const [tierFilter, setTierFilter] = useState<typeof ALL_FILTER_VALUE | ApiJob["tier"]>(ALL_FILTER_VALUE);

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [allWorkModeOptions, setAllWorkModeOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(1);

  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
      });

      if (statusFilter !== ALL_FILTER_VALUE) {
        params.set("status", statusFilter);
      }
      if (typeFilter !== ALL_FILTER_VALUE) {
        params.set("employmentType", typeFilter);
      }
      if (tierFilter !== ALL_FILTER_VALUE) {
        params.set("tier", tierFilter);
      }
      if (workModeFilter !== ALL_FILTER_VALUE) {
        params.set("workMode", workModeFilter);
      }

      const response = await fetch(`${API_BASE}/job?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? payload?.message ?? "Failed to load jobs");
      }
      setJobs(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter, tierFilter, workModeFilter]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const fetchWorkModes = async () => {
      try {
        const response = await fetch(`${API_BASE}/job?page=1&limit=100`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const payload = await response.json();
        if (!response.ok) {
          return;
        }

        const data: ApiJob[] = Array.isArray(payload?.data) ? payload.data : [];
        const workModes = Array.from(new Set(data.map((job) => job.workMode).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        setAllWorkModeOptions(workModes);
      } catch {
        setAllWorkModeOptions([]);
      }
    };

    void fetchWorkModes();
  }, []);

  const statusOptions = STATUS_ORDER;
  const employmentTypeOptions = EMPLOYMENT_TYPE_ORDER;
  const tierOptions = TIER_ORDER;

  const workModeOptions = useMemo(() => {
    return allWorkModeOptions;
  }, [allWorkModeOptions]);

  const handleCloseJob = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/job/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "CLOSED" }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? payload?.message ?? "Failed to close job");
      }
      void fetchJobs();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to close job");
    }
  };

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedJobs = jobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Placement Drives</h1>
          <p className="text-sm text-slate-500">Manage internship and placement opportunities</p>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
          onClick={() => router.push("/create-jobs")}
        >
          <Plus size={16} />
          Create Job Posting
        </button>
      </div>

      {/* Error banner */}
      {errorMessage && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof ALL_FILTER_VALUE | ApiJob["status"]);
            setPage(1);
          }}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value={ALL_FILTER_VALUE}>All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatEnumLabel(status)}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as typeof ALL_FILTER_VALUE | ApiJob["employmentType"]);
            setPage(1);
          }}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value={ALL_FILTER_VALUE}>Type</option>
          {employmentTypeOptions.map((employmentType) => (
            <option key={employmentType} value={employmentType}>
              {formatEnumLabel(employmentType)}
            </option>
          ))}
        </select>

        <select
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value as typeof ALL_FILTER_VALUE | ApiJob["tier"]);
            setPage(1);
          }}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value={ALL_FILTER_VALUE}>Tier</option>
          {tierOptions.map((tier) => (
            <option key={tier} value={tier}>
              {formatEnumLabel(tier)}
            </option>
          ))}
        </select>

        <select
          value={workModeFilter}
          onChange={(e) => {
            setWorkModeFilter(e.target.value);
            setPage(1);
          }}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value={ALL_FILTER_VALUE}>Work Mode</option>
          {workModeOptions.map((workMode) => (
            <option key={workMode} value={workMode}>
              {workMode}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setStatusFilter(ALL_FILTER_VALUE);
            setTypeFilter(ALL_FILTER_VALUE);
            setTierFilter(ALL_FILTER_VALUE);
            setWorkModeFilter(ALL_FILTER_VALUE);
            setPage(1);
          }}
          className="flex items-center gap-1 border border-slate-200 px-3 py-2 rounded-md text-sm bg-white shadow-sm hover:bg-slate-50"
        >
          <Filter size={14} />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-slate-600">
                <th className="px-5 py-3 text-center font-semibold">Company</th>
                <th className="px-5 py-3 text-center font-semibold">Role</th>
                <th className="px-5 py-3 text-center font-semibold">Type</th>
                <th className="px-5 py-3 text-center font-semibold">Package</th>
                <th className="px-5 py-3 text-center font-semibold">Work Mode</th>
                <th className="px-5 py-3 text-center font-semibold">Deadline</th>
                <th className="px-5 py-3 text-center font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr key={job.id} className="border-t hover:bg-slate-50 text-center">
                    <td className="px-5 py-4 font-medium">{job.company.name}</td>
                    <td className="px-5 py-4">{job.role}</td>
                    <td className="px-5 py-4 capitalize">{job.employmentType.replace("_", " ").toLowerCase()}</td>
                    <td className="px-5 py-4">{job.ctc ?? "-"}</td>
                    <td className="px-5 py-4">{job.workMode}</td>
                    <td className="px-5 py-4">{new Date(job.closeAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass[job.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100"
                          onClick={() => router.push(`/all-jobs/${job.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100"
                          onClick={() => router.push("/candidates-pipeline")}
                        >
                          Applicants
                        </button>
                        <button
                          disabled={job.status === "CLOSED"}
                          className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100 disabled:opacity-40"
                          onClick={() => void handleCloseJob(job.id)}
                        >
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, jobs.length)} of {jobs.length}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded-md disabled:opacity-40 bg-slate-300 text-black">
              Prev
            </button>

            <span className="px-2">Page {page}</span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="border px-3 py-1 rounded-md disabled:opacity-40 bg-slate-300 text-black"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
