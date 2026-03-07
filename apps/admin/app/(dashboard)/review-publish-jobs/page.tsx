"use client";

import JobSummary from "./components/JobSummary";
import ApplicationFormPreview from "./components/ApplicationFormPreview";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ReviewJobPage() {
  const router = useRouter();

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
      <JobSummary />

      {/* Form Preview */}
      <ApplicationFormPreview />

      {/* Bottom Buttons */}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
        <button className="border border-slate-200 px-4 py-2 rounded-md text-sm hover:bg-slate-50  cursor-pointer">Save Draft</button>

        <button
          className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 cursor-pointer"
          onClick={() => router.push("/all-jobs")}
        >
          Publish Job
        </button>
      </div>
    </div>
  );
}
