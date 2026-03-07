"use client";

import { useEffect, useState } from "react";
import { PlacementProgressSection } from "./placement-progress-section";
import {
  NextImportantActionsSection,
  type NextAction,
} from "./next-important-actions-section";
import {
  EligibleCompaniesSection,
  type EligibleCompany,
} from "./eligible-companies-section";
import { PrepareForInterviewsSection } from "./prepare-for-interviews-section";
import { getStudentJobs } from "./jobs/job-api";

const API_BASE = "http://localhost:5501/api/v1";

type StudentProfileResponse = {
  data?: {
    user?: {
      firstName?: string | null;
    } | null;
  } | null;
};

type StudentApplication = {
  id: string;
  status:
    | "DRAFT"
    | "APPLIED"
    | "SCREENING"
    | "PHONE_SCREEN"
    | "INTERVIEW"
    | "OFFER"
    | "HIRED"
    | "REJECTED"
    | "ARCHIVED";
  createdAt?: string;
  job?: {
    id: string;
    title?: string | null;
    closeAt?: string | null;
    company?: {
      name?: string | null;
    } | null;
  } | null;
  stage?: {
    name?: string | null;
  } | null;
};

type MyApplicationsResponse = {
  success?: boolean;
  data?: StudentApplication[];
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function formatActionDate(dateStr?: string | null) {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(dateStr?: string | null) {
  if (!dateStr) return Number.POSITIVE_INFINITY;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return Number.POSITIVE_INFINITY;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("Student");
  const [placementProgress, setPlacementProgress] = useState([
    { title: "Applications", value: 0, icon: "applications" as const },
    { title: "Shortlisted", value: 0, icon: "shortlisted" as const },
    { title: "Interviews", value: 0, icon: "interviews" as const },
  ]);
  const [nextActions, setNextActions] = useState<NextAction[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<EligibleCompany[]>(
    [],
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const headers = getAuthHeaders();

        const [profileRes, appsRes, jobs] = await Promise.all([
          fetch(`${API_BASE}/student/profile`, { headers }),
          fetch(`${API_BASE}/student-application/mine`, { headers }),
          getStudentJobs(),
        ]);

        if (profileRes.ok) {
          const profileBody = (await profileRes.json()) as StudentProfileResponse;
          const fetchedFirstName = profileBody?.data?.user?.firstName;
          if (typeof fetchedFirstName === "string" && fetchedFirstName.trim()) {
            setFirstName(fetchedFirstName.trim());
          }
        }

        let applications: StudentApplication[] = [];
        if (appsRes.ok) {
          const appsBody = (await appsRes.json()) as MyApplicationsResponse;
          applications = appsBody?.data || [];
        }

        const shortlistedStatuses = new Set([
          "SCREENING",
          "PHONE_SCREEN",
          "INTERVIEW",
          "OFFER",
          "HIRED",
        ]);
        const interviewStatuses = new Set(["PHONE_SCREEN", "INTERVIEW"]);

        const shortlistedCount = applications.filter((a) =>
          shortlistedStatuses.has(a.status),
        ).length;
        const interviewCount = applications.filter((a) =>
          interviewStatuses.has(a.status),
        ).length;

        setPlacementProgress([
          { title: "Applications", value: applications.length, icon: "applications" },
          { title: "Shortlisted", value: shortlistedCount, icon: "shortlisted" },
          { title: "Interviews", value: interviewCount, icon: "interviews" },
        ]);

        const applicationActions: NextAction[] = applications
          .filter((a) => a.status === "DRAFT" || interviewStatuses.has(a.status))
          .slice(0, 4)
          .map((a) => {
            if (a.status === "DRAFT") {
              return {
                id: `draft-${a.id}`,
                type: "resume",
                title: "Complete Application Form",
                status: "Pending",
                company: a.job?.company?.name || "Company",
                date: formatActionDate(a.job?.closeAt),
                time: "",
              };
            }

            return {
              id: `interview-${a.id}`,
              type: "technical",
              title: a.stage?.name || "Interview Round",
              status: "Scheduled",
              company: a.job?.company?.name || "Company",
              date: formatActionDate(a.job?.closeAt),
              time: "",
            };
          });

        const appliedJobIds = new Set(
          applications.map((a) => a.job?.id).filter(Boolean),
        );

        const eligibleCards: EligibleCompany[] = jobs
          .filter((job) => job.eligible && !appliedJobIds.has(job.id))
          .slice(0, 3)
          .map((job) => {
            const d = daysUntil(job.deadline);
            const status: EligibleCompany["status"] = d <= 3 ? "Closing Soon" : "New";
            return {
              id: job.id,
              name: job.company,
              role: job.role,
              salary: `INR ${job.salary} LPA`,
              location: job.location,
              status,
            };
          });

        setEligibleCompanies(eligibleCards);

        const deadlineActions: NextAction[] = jobs
          .filter((job) => job.eligible && !appliedJobIds.has(job.id))
          .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
          .slice(0, 3)
          .map((job) => ({
            id: `job-${job.id}`,
            type: "assessment",
            title: "Apply Before Deadline",
            status: daysUntil(job.deadline) <= 2 ? "Urgent" : "Pending",
            company: job.company,
            date: job.deadline,
            time: "End of Day",
          }));

        const mergedActions = [...applicationActions, ...deadlineActions].slice(0, 4);
        setNextActions(mergedActions);
      } catch {
        // keep fallback defaults on API failure
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s your placement progress overview
        </p>
      </div>

      <div className="space-y-6">
        <PlacementProgressSection stats={placementProgress} />
        <NextImportantActionsSection actions={nextActions} />
        <EligibleCompaniesSection companies={eligibleCompanies} />
        <PrepareForInterviewsSection />
      </div>
    </div>
  );
}
