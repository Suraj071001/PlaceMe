"use client";

import JobSummary from "./components/JobSummary";
import ApplicationFormPreview from "./components/ApplicationFormPreview";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ReviewJobPage() {
  const router = useRouter();

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-7 space-y-6">
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
      <div className="flex justify-end gap-3 pt-2">
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
