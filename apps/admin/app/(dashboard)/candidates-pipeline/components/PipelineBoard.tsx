"use client";

import { useState } from "react";
import { stages, students as initialStudents, stageOrder } from "../../../components/data";
import PipelineStage from "./PipelineStages";
import { Briefcase } from "lucide-react";

const stageStyleMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
  online_assessment: { label: "Online Assessment", color: "text-green-600 bg-green-50 border-green-200" },
  technical_interview: { label: "Technical Interview", color: "text-blue-600 bg-blue-50 border-blue-200" },
  hr_interview: { label: "HR Interview", color: "text-purple-600 bg-purple-50 border-purple-200" },
  selected: { label: "Selected", color: "text-green-700 bg-green-50 border-green-200" },
  rejected: { label: "Rejected", color: "text-red-500 bg-red-50 border-red-200" },
};

const tierStyleMap: Record<string, string> = {
  Dream: "text-orange-500",
  "Tier 1": "text-blue-500",
  "Tier 2": "text-pink-500",
  "Tier 3": "text-gray-500",
};

const typeStyleMap: Record<string, string> = {
  "Full-time": "text-green-600 bg-green-50 border border-green-200",
  Internship: "text-orange-500 bg-orange-50 border border-orange-200",
};

export default function PipelineBoard() {
  const [students, setStudents] = useState(initialStudents);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const moveSelectedForward = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (!selected.includes(String(s.id))) return s;
        const currentIndex = stageOrder.indexOf(s.stage);
        const nextStage = stageOrder[currentIndex + 1];
        if (!nextStage) return s;
        return { ...s, stage: nextStage };
      }),
    );
    setSelected([]);
  };

  // Stage counts for summary cards
  const stageCounts = stageOrder.reduce(
    (acc, stageId) => {
      acc[stageId] = students.filter((s) => s.stage === stageId).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="h-full flex flex-col mr-50">
      {/* ── Mobile View ── */}
      <div className="flex flex-col h-full md:hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 px-3 pt-3 pb-2">
          {stageOrder.map((stageId) => {
            const style = stageStyleMap[stageId];
            return (
              <div key={stageId} className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-2 px-1 shadow-sm">
                <span className="text-lg font-bold text-indigo-600">{stageCounts[stageId] ?? 0}</span>
                <span className="text-center text-[10px] text-gray-500 leading-tight mt-0.5">{style?.label ?? stageId}</span>
              </div>
            );
          })}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-x-3 px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 bg-gray-50 overflow-x-auto whitespace-nowrap">
          <span>Company</span>
          <span>Role</span>
          <span>Type</span>
          <span>Tier</span>
          <span>Package</span>
          <span>Location</span>
          <span>Status</span>
          <span>Applied Date</span>
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pb-24">
          {students.map((s: any) => {
            const id = String(s.id);
            const stageStyle = stageStyleMap[s.stage];
            const isSelected = selected.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSelect(id)}
                className={`w-full grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-x-3 items-center px-4 py-3 text-left overflow-x-auto whitespace-nowrap transition ${
                  isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Company */}
                <span className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                  </span>
                  {s.company ?? s.companyName ?? "—"}
                </span>

                {/* Role */}
                <span className="text-sm text-gray-700 truncate">{s.role ?? s.jobRole ?? "—"}</span>

                {/* Type */}
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                    typeStyleMap[s.type ?? s.employmentType ?? ""] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.type ?? s.employmentType ?? "—"}
                </span>

                {/* Tier */}
                <span className={`text-xs font-semibold ${tierStyleMap[s.tier ?? ""] ?? "text-gray-500"}`}>{s.tier ?? "—"}</span>

                {/* Package */}
                <span className="text-sm font-medium text-gray-800">{s.package ?? s.ctc ?? "—"}</span>

                {/* Location */}
                <span className="text-sm text-gray-600">{s.location ?? "—"}</span>

                {/* Status */}
                <span
                  className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${
                    stageStyle?.color ?? "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {stageStyle?.label ?? s.stage}
                </span>

                {/* Applied Date */}
                <span className="text-sm text-gray-500">{s.appliedDate ?? s.appliedAt ?? "—"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop View (Pipeline Board) ── */}
      <div className="relative hidden h-full md:block">
        <div className="h-full w-full overflow-x-auto overflow-y-hidden pipeline-scroll">
          <div className="flex h-full w-max gap-4 px-2 pb-1 sm:gap-6 sm:px-4 lg:px-8">
            {stages.map((stage) => {
              const stageStudents = students.filter((s) => s.stage === stage.id).map((s) => ({ ...s, id: String(s.id) }));

              return <PipelineStage key={stage.id} stage={stage} students={stageStudents} selected={selected} toggleSelect={toggleSelect} />;
            })}
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar (both views) ── */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg sm:bottom-6 sm:w-auto sm:max-w-none sm:flex-nowrap sm:gap-4 sm:px-6">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <button onClick={moveSelectedForward} className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700">
            Move Forward
          </button>
          <button onClick={() => setSelected([])} className="text-sm text-gray-500 hover:text-gray-700">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
