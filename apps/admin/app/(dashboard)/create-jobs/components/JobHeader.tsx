"use client";

import { Save, Plus, ArrowLeft } from "lucide-react";
import ActionBtn from "./ActionBtn";
import { useRouter } from "next/navigation";
import { useJobDraft } from "../lib/useJobDraft";

export default function CreateJobHeader() {
  const router = useRouter();
  const { isPublishable } = useJobDraft();
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Title Section */}
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="m-0 text-lg font-semibold text-slate-900 sm:text-xl">Create Job Posting</h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Define your role and start receiving applications</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2.5">
          <ActionBtn
            label="Save Draft"
            icon={<Save size={15} />}
            onClick={() => window.alert("Draft saved")}
          />

          <button
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white ${
              isPublishable ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"
            }`}
            onClick={() => router.push("/application-form")}
            disabled={!isPublishable}
          >
            <Plus size={15} /> Next Application Form
          </button>
        </div>
      </div>
    </div>
  );
}
