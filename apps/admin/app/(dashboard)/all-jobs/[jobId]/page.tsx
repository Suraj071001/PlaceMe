"use client";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CircleDollarSign,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../../lib/api";

type ApiJobDetails = {
  id: string;
  title: string;
  role: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT" | "PAUSED" | "ARCHIVED";
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "TEMPORARY"
    | "INTERNSHIP";
  workMode: string;
  ctc: string | null;
  tier: "BASIC" | "STANDARD" | "DREAM";
  location: string | null;
  description: string | null;
  minimumCGPA: number | null;
  passingYear: number | null;
  applicationDeadline: string | null;
  openAt: string;
  closeAt: string;
  createdAt: string;
  company: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
};

const statusBadgeClass: Record<ApiJobDetails["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DRAFT: "bg-amber-100 text-amber-700",
  CLOSED: "bg-red-100 text-red-700",
  PAUSED: "bg-orange-100 text-orange-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function JobDetailsPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const jobId = params?.jobId;

  const [job, setJob] = useState<ApiJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_BASE}/job/${jobId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.error ?? payload?.message ?? "Failed to load job details",
        );
      }

      setJob(payload?.data ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load job details",
      );
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    void fetchJob();
  }, [fetchJob]);

  const summaryItems = useMemo(
    () => [
      { icon: Building2, label: "Company", value: job?.company?.name ?? "-" },
      { icon: Briefcase, label: "Role", value: job?.role ?? "-" },
      { icon: MapPin, label: "Location", value: job?.location || "-" },
      { icon: CircleDollarSign, label: "Package", value: job?.ctc || "-" },
      { icon: Users, label: "Department", value: job?.department?.name ?? "-" },
      {
        icon: Calendar,
        label: "Apply By",
        value: formatDate(job?.applicationDeadline ?? job?.closeAt),
      },
    ],
    [job],
  );

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push("/all-jobs")}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900">
              Job Details
            </h1>
            <p className="text-sm text-slate-500">
              Review complete job posting information
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/candidates-pipeline?jobId=${jobId}`)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          View Applicants
        </button>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
          Loading job details...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{errorMessage}</p>
          <button
            onClick={() => void fetchJob()}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && job && (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {job.company?.name ?? "Company"}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {job.title}
                </h2>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass[job.status] ?? "bg-slate-100 text-slate-600"}`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-slate-200 p-3"
                >
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                    <item.icon size={14} />
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Posting Details
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="text-slate-500">Employment Type:</span>{" "}
                  {formatEnumLabel(job.employmentType)}
                </p>
                <p>
                  <span className="text-slate-500">Work Mode:</span>{" "}
                  {job.workMode}
                </p>
                <p>
                  <span className="text-slate-500">Tier:</span>{" "}
                  {formatEnumLabel(job.tier)}
                </p>
                <p>
                  <span className="text-slate-500">Minimum CGPA:</span>{" "}
                  {job.minimumCGPA ?? "-"}
                </p>
                <p>
                  <span className="text-slate-500">Passing Year:</span>{" "}
                  {job.passingYear ?? "-"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">Timeline</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="text-slate-500">Opened On:</span>{" "}
                  {formatDate(job.openAt)}
                </p>
                <p>
                  <span className="text-slate-500">Application Deadline:</span>{" "}
                  {formatDate(job.applicationDeadline ?? job.closeAt)}
                </p>
                <p>
                  <span className="text-slate-500">Close Date:</span>{" "}
                  {formatDate(job.closeAt)}
                </p>
                <p>
                  <span className="text-slate-500">Created On:</span>{" "}
                  {formatDate(job.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText size={16} />
              Description
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {job.description?.trim()
                ? job.description
                : "No description provided."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
