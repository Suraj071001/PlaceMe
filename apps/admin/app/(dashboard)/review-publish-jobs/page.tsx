"use client";

import JobSummary from "./components/JobSummary";
import ApplicationFormPreview from "./components/ApplicationFormPreview";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useJobDraft } from "../create-jobs/lib/useJobDraft";

export default function ReviewJobPage() {
  const router = useRouter();
  const { draft, reset, isPublishable } = useJobDraft();
  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const publish = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Not logged in");
      return;
    }

    const validBatchIds = (draft.batchIds ?? []).filter((id): id is string => typeof id === "string" && isUuid(id));
    const validDepartmentId = typeof draft.departmentId === "string" && isUuid(draft.departmentId) ? draft.departmentId : undefined;

    const payload: any = {
      companyId: draft.companyId,
      title: draft.title,
      role: draft.role ?? draft.title,
      workMode: draft.workMode,
      closeAt: draft.closeAt,
      applicationDeadline: draft.applicationDeadline ?? draft.closeAt,
      ctc: draft.ctc,
      minimumCGPA: draft.minimumCGPA,
      passingYear: draft.passingYear,
      employmentType: draft.employmentType,
      tier: draft.tier,
      status: "ACTIVE",
      google_chat: Boolean(draft.google_chat),
      email: Boolean(draft.email),
      description: draft.description,
      additionalDetails: {
        ...(draft.additionalDetails ?? {}),
        eligibleDepartments: draft.departmentNames ?? [],
        eligibleBranches: draft.branchNames ?? [],
        eligibleBatches: draft.batchNames ?? [],
      },
      departmentId: validDepartmentId,
      batchIds: validBatchIds,
      applicationForm: draft.applicationForm,
    };

    try {
      const res = await fetch("http://localhost:5501/api/v1/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        window.alert(json?.error ?? "Failed to publish job");
        return;
      }

      reset();
      router.push("/all-jobs");
    } catch (err: any) {
      window.alert(err?.message ?? "Failed to publish job");
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => router.back()} className="flex items-center justify-center w-9 h-9 text-slate-600 cursor-pointer">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[22px] font-semibold">Review Job Posting</h1>
          <p className="text-sm text-slate-500">Confirm job details and application form before publishing</p>
        </div>
      </div>

      {/* Job Summary */}
      <JobSummary draft={draft} />

      {/* Form Preview */}
      <ApplicationFormPreview draft={draft} />

      {/* Bottom Buttons */}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
        <button className="border border-slate-200 px-4 py-2 rounded-md text-sm hover:bg-slate-50  cursor-pointer">Save Draft</button>

        <button
          className={`text-white px-5 py-2 rounded-md text-sm font-medium cursor-pointer ${
            isPublishable ? "bg-green-600 hover:bg-green-700" : "bg-slate-400 cursor-not-allowed"
          }`}
          disabled={!isPublishable}
          onClick={publish}
        >
          Publish Job
        </button>
      </div>
    </div>
  );
}
