"use client";

import { useEffect, useMemo, useState } from "react";
import PipelineStage from "./PipelineStages";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

type JobItem = {
  id: string;
  title?: string;
  role?: string;
  ctc?: string;
  company?: { name?: string };
  department?: { name?: string };
};

type ApplicationItem = {
  id: string;
  status?: string;
  createdAt?: string;
  stage?: { id?: string; name?: string } | null;
  job?: {
    id?: string;
    title?: string;
    role?: string;
    ctc?: string;
    employmentType?: string;
    location?: string;
    workMode?: string;
    tier?: string;
    company?: { name?: string };
    department?: { name?: string };
  };
  student?: {
    user?: { firstName?: string; lastName?: string };
    branch?: { name?: string };
    batch?: { name?: string };
  };
};

type PipelineStudent = {
  id: string;
  stageId?: string;
  name: string;
  stage: string;
  stageLabel: string;
  status: string;
  company: string;
  role: string;
  type: string;
  tier: string;
  package: string;
  location: string;
  appliedDate: string;
  department: string;
  branch: string;
  batch: string;
};

type StageCol = { id: string; title: string; color: string };

const API_BASE =
  typeof window !== "undefined" ? "http://localhost:5501/api/v1" : "";

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const text = await res.text();
    throw new Error(`Non-JSON response: ${text.slice(0, 80)}`);
  }
  return res.json();
}

const stageStyleMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "bg-blue-100" },
  screening: { label: "Screening", color: "bg-slate-100" },
  interview: { label: "Interview", color: "bg-orange-100" },
  technical_interview: { label: "Technical Interview", color: "bg-cyan-100" },
  offer: { label: "Offer", color: "bg-emerald-100" },
  hired: { label: "Hired", color: "bg-lime-100" },
};

const typeStyleMap: Record<string, string> = {
  FULL_TIME: "text-green-600 bg-green-50 border border-green-200",
  INTERNSHIP: "text-orange-500 bg-orange-50 border border-orange-200",
  PART_TIME: "text-blue-600 bg-blue-50 border border-blue-200",
  CONTRACT: "text-violet-600 bg-violet-50 border border-violet-200",
};

const tierStyleMap: Record<string, string> = {
  DREAM: "text-orange-500",
  STANDARD: "text-blue-500",
  BASIC: "text-gray-500",
};

const stagePriority = [
  "applied",
  "screening",
  "interview",
  "technical_interview",
  "offer",
  "hired",
];

const toStageKey = (value?: string | null) => {
  if (!value) return "applied";
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const toTitle = (stageKey: string) =>
  stageStyleMap[stageKey]?.label ??
  stageKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (date?: string) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
};

export default function PipelineBoard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [allStudents, setAllStudents] = useState<PipelineStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<PipelineStudent[]>(
    [],
  );
  const [selected, setSelected] = useState<string[]>([]);

  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [error, setError] = useState<string>("");

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const res = await fetch(`${API_BASE}/job?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          setError(`Failed to fetch jobs: ${res.status} ${errorText}`);
          setJobs([]);
          return;
        }
        const body = await safeJson(res);
        const list = Array.isArray(body?.data) ? (body.data as JobItem[]) : [];
        setJobs(list);
        if (!selectedJobId && list.length > 0) setSelectedJobId(list[0]!.id);
        setError("");
      } catch (err) {
        setError(
          `Error fetching jobs: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setJobs([]);
      }
    };

    fetchJobs();
  }, [selectedJobId]);

  useEffect(() => {
    const fetchAllApplications = async () => {
      if (!selectedJobId) {
        setAllStudents([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setAllStudents([]);
          return;
        }

        const res = await fetch(
          `${API_BASE}/admin-applications/job/${selectedJobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res.ok) {
          const errorText = await res.text();
          setError(`Failed to fetch applications: ${res.status} ${errorText}`);
          setAllStudents([]);
          return;
        }

        const body = await safeJson(res);
        const list = Array.isArray(body?.data)
          ? (body.data as ApplicationItem[])
          : [];

        const mapped = list.map((item) => {
          const first = item.student?.user?.firstName ?? "";
          const last = item.student?.user?.lastName ?? "";
          const stageLabel = item.stage?.name ?? item.status ?? "Applied";
          const stage = toStageKey(stageLabel);
          return {
            id: item.id,
            stageId: item.stage?.id ?? undefined,
            name: `${first} ${last}`.trim() || "Unknown Student",
            stage,
            stageLabel: toTitle(stage),
            status: item.status ?? "APPLIED",
            company: item.job?.company?.name ?? "—",
            role: item.job?.role ?? item.job?.title ?? "—",
            type: item.job?.employmentType ?? "—",
            tier: item.job?.tier ?? "—",
            package: item.job?.ctc ?? "—",
            location: item.job?.location ?? item.job?.workMode ?? "—",
            appliedDate: formatDate(item.createdAt),
            department: item.job?.department?.name ?? "—",
            branch: item.student?.branch?.name ?? "—",
            batch: item.student?.batch?.name ?? "—",
          };
        });

        setAllStudents(mapped);
        setError("");
      } catch (err) {
        setError(
          `Error fetching applications: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setAllStudents([]);
      }
    };

    fetchAllApplications();
  }, [selectedJobId]);

  useEffect(() => {
    const fetchFilteredApplications = async () => {
      if (!selectedJobId) {
        setFilteredStudents([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setFilteredStudents([]);
          return;
        }

        const params = new URLSearchParams();
        if (branchFilter !== "All Branches")
          params.append("branch", branchFilter);
        if (batchFilter !== "All Batches") params.append("batch", batchFilter);
        if (stageFilter !== "All Stages") params.append("stage", stageFilter);
        if (statusFilter !== "All Status")
          params.append("status", statusFilter);

        const query = params.toString();
        const url = `${API_BASE}/admin-applications/job/${selectedJobId}${query ? `?${query}` : ""}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          setError(
            `Failed to fetch filtered applications: ${res.status} ${errorText}`,
          );
          setFilteredStudents([]);
          return;
        }

        const body = await safeJson(res);
        const list = Array.isArray(body?.data)
          ? (body.data as ApplicationItem[])
          : [];

        const mapped = list.map((item) => {
          const first = item.student?.user?.firstName ?? "";
          const last = item.student?.user?.lastName ?? "";
          const stageLabel = item.stage?.name ?? item.status ?? "Applied";
          const stage = toStageKey(stageLabel);
          return {
            id: item.id,
            stageId: item.stage?.id ?? undefined,
            name: `${first} ${last}`.trim() || "Unknown Student",
            stage,
            stageLabel: toTitle(stage),
            status: item.status ?? "APPLIED",
            company: item.job?.company?.name ?? "—",
            role: item.job?.role ?? item.job?.title ?? "—",
            type: item.job?.employmentType ?? "—",
            tier: item.job?.tier ?? "—",
            package: item.job?.ctc ?? "—",
            location: item.job?.location ?? item.job?.workMode ?? "—",
            appliedDate: formatDate(item.createdAt),
            department: item.job?.department?.name ?? "—",
            branch: item.student?.branch?.name ?? "—",
            batch: item.student?.batch?.name ?? "—",
          };
        });

        setFilteredStudents(mapped);
        setSelected([]);
        setError("");
      } catch (err) {
        setError(
          `Error fetching filtered applications: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setFilteredStudents([]);
      }
    };

    fetchFilteredApplications();
  }, [selectedJobId, branchFilter, batchFilter, stageFilter, statusFilter]);

  const filterOptions = useMemo(() => {
    const uniq = (values: string[]) =>
      Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
      );
    return {
      branches: uniq(allStudents.map((s) => s.branch)),
      batches: uniq(allStudents.map((s) => s.batch)),
      stages: uniq(allStudents.map((s) => s.stageLabel)),
      statuses: uniq(allStudents.map((s) => s.status)),
    };
  }, [allStudents]);

  const stageColumns: StageCol[] = useMemo(() => {
    // Always show all stages from stagePriority, even if they're empty
    return stagePriority.map((key) => ({
      id: key,
      title: toTitle(key),
      color: stageStyleMap[key]?.color ?? "bg-gray-100",
    }));
  }, []);

  const stageDbIdByKey = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of allStudents) {
      if (s.stageId && !map[s.stage]) {
        map[s.stage] = s.stageId;
      }
    }
    return map;
  }, [allStudents]);

  const moveSelectedForward = async () => {
    const originalStudents = [...filteredStudents];
    const updatedStudents = filteredStudents.map((s) => {
      if (!selected.includes(s.id)) return s;
      const currentIndex = stageColumns.findIndex((c) => c.id === s.stage);
      const nextStage = stageColumns[currentIndex + 1];
      if (!nextStage) return s;
      return {
        ...s,
        stage: nextStage.id,
        stageLabel: nextStage.title,
        stageId: stageDbIdByKey[nextStage.id],
      };
    });
    setFilteredStudents(updatedStudents);

    const token = localStorage.getItem("token");
    for (const applicationId of selected) {
      const student = updatedStudents.find((s) => s.id === applicationId);
      if (!student || !token || !student.stageId) continue;
      try {
        await fetch(`${API_BASE}/admin-applications/${applicationId}/stage`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ stageId: student.stageId }),
        });
      } catch {
        setFilteredStudents(originalStudents);
      }
    }
    setSelected([]);
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {error && (
        <div className="mx-4 mt-4 rounded-md bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2 px-4 py-3 bg-white border-b">
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="rounded-md border-gray-300 text-sm py-1.5 px-2"
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.company?.name ?? "Company"} •{" "}
              {job.role ?? job.title ?? "Role"}
            </option>
          ))}
        </select>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm py-1.5 px-2"
        >
          <option>All Branches</option>
          {filterOptions.branches.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm py-1.5 px-2"
        >
          <option>All Batches</option>
          {filterOptions.batches.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm py-1.5 px-2"
        >
          <option>All Stages</option>
          {filterOptions.stages.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm py-1.5 px-2"
        >
          <option>All Status</option>
          {filterOptions.statuses.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 rounded-xl border bg-white p-4 text-center text-sm sm:grid-cols-4 sm:gap-4 mt-3 mx-4">
        <div className="min-w-0">
          <p className="text-gray-500">Company</p>
          <p className="font-medium truncate">
            {selectedJob?.company?.name ?? "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-gray-500">Role</p>
          <p className="font-medium truncate">
            {selectedJob?.role ?? selectedJob?.title ?? "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-gray-500">Package</p>
          <p className="font-medium">{selectedJob?.ctc ?? "—"}</p>
        </div>
        <div className="min-w-0">
          <p className="text-gray-500">Applicants</p>
          <p className="font-medium">{filteredStudents.length}</p>
        </div>
      </div>

      <div className="flex flex-col h-full md:hidden">
        <div className="grid grid-cols-3 gap-2 px-3 pt-3 pb-2">
          {stageColumns.map((stage) => (
            <div
              key={stage.id}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-2 px-1 shadow-sm"
            >
              <span className="text-lg font-bold text-indigo-600">
                {filteredStudents.filter((s) => s.stage === stage.id).length}
              </span>
              <span className="text-center text-[10px] text-gray-500 leading-tight mt-0.5">
                {stage.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-x-3 px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              <span>Company</span>
              <span>Role</span>
              <span>Type</span>
              <span>Tier</span>
              <span>Package</span>
              <span>Location</span>
              <span>Status</span>
              <span>Applied Date</span>
            </div>
            <div className="divide-y divide-gray-100 pb-24">
              {filteredStudents.map((s) => {
                const isSelected = selected.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSelect(s.id)}
                    className={`w-full grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-x-3 items-center px-4 py-3 text-left transition ${isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                      </span>
                      {s.company}
                    </span>
                    <span className="text-sm text-gray-700 truncate">
                      {s.role}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${typeStyleMap[s.type] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {s.type}
                    </span>
                    <span
                      className={`text-xs font-semibold ${tierStyleMap[s.tier] ?? "text-gray-500"}`}
                    >
                      {s.tier}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {s.package}
                    </span>
                    <span className="text-sm text-gray-600">{s.location}</span>
                    <span className="inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border-gray-200">
                      {s.stageLabel}
                    </span>
                    <span className="text-sm text-gray-500">
                      {s.appliedDate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden h-full min-h-0 md:block">
        <div className="h-full w-full overflow-y-hidden overflow-x-hidden">
          {stageColumns.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No applications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedJob
                    ? `No applications found for ${selectedJob.title || selectedJob.role}`
                    : "Select a job to view applications"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="grid h-full gap-3 px-2 pb-1 sm:gap-4 sm:px-4 lg:px-6"
              style={{
                gridTemplateColumns: `repeat(${Math.max(stageColumns.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {stageColumns.map((stage) => {
                const stageStudents = filteredStudents
                  .filter((s) => s.stage === stage.id)
                  .map((s) => ({
                    ...s,
                    date: s.appliedDate,
                    branch: s.branch,
                  }));
                return (
                  <PipelineStage
                    key={stage.id}
                    stage={stage}
                    students={stageStudents}
                    selected={selected}
                    toggleSelect={toggleSelect}
                    onViewForm={(id) =>
                      router.push(`/candidates-pipeline/form-response/${id}`)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg sm:bottom-6 sm:w-auto sm:max-w-none sm:flex-nowrap sm:gap-4 sm:px-6">
          <span className="text-sm font-medium">
            {selected.length} selected
          </span>
          <button
            onClick={moveSelectedForward}
            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Move Forward
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
