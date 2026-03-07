"use client";

import { useState, useEffect } from "react";
import { stages, students as initialStudents, stageOrder } from "../../../components/data";
import PipelineStage from "./PipelineStages";
import { Briefcase } from "lucide-react";

type PipelineStudent = (typeof initialStudents)[number] & {
  company?: string;
  companyName?: string;
  role?: string;
  jobRole?: string;
  type?: string;
  employmentType?: string;
  tier?: string;
  package?: string;
  ctc?: string;
  location?: string;
  workMode?: string;
  appliedDate?: string;
  appliedAt?: string;
};

const stageStyleMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
  shortlisted: { label: "Shortlisted", color: "text-purple-600 bg-purple-50 border-purple-200" },
  interview: { label: "Interview", color: "text-blue-600 bg-blue-50 border-blue-200" },
  final: { label: "Final", color: "text-amber-600 bg-amber-50 border-amber-200" },
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
  const [students, setStudents] = useState<PipelineStudent[]>(initialStudents as PipelineStudent[]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real application, jobId would come from router params or props.
  const jobId = "1"; // Mock job ID for the current "Amazon SDE Intern" context

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/admin-applications/job/${jobId}`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          // Map DB applications to UI format
          const mappedStudents = json.data.map((app: any) => ({
            id: app.id,
            name: `${app.student?.user?.firstName || ''} ${app.student?.user?.lastName || ''}`.trim() || 'Student',
            email: app.student?.user?.email,
            stage: app.stage?.name.toLowerCase() || app.stageId,
            branch: app.student?.branch?.name || '',
            company: "Amazon", // Mocked for UI context
            role: "SDE Intern",
            type: "Internship",
            appliedDate: new Date(app.createdAt).toLocaleDateString(),
          }));
          setStudents(mappedStudents);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const moveSelectedForward = async () => {
    const originalStudents = [...students];
    const updatedStudents = students.map((s) => {
      if (!selected.includes(String(s.id))) return s;
      const currentIndex = stageOrder.indexOf(s.stage);
      const nextStage = stageOrder[currentIndex + 1];
      if (!nextStage) return s;
      return { ...s, stage: nextStage };
    });
    setStudents(updatedStudents);

    // Call API to update stages in backend
    for (const studentId of selected) {
      const student = updatedStudents.find(s => String(s.id) === studentId);
      if (student) {
        try {
          await fetch(`http://localhost:3000/api/v1/admin-applications/${studentId}/stage`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stageId: student.stage })
          });
        } catch (e) {
          console.error(`Failed to update stage for student ${studentId}`);
        }
      }
    }
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
    <div className="h-full flex flex-col">
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

        {/* Table Header + Rows — single horizontal scroll container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="min-w-[700px]">
            {/* Table Header */}
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

            {/* Table Rows */}
            <div className="divide-y divide-gray-100 pb-24">
              {students.map((s) => {
                const id = String(s.id);
                const stageStyle = stageStyleMap[s.stage];
                const isSelected = selected.includes(id);
                const company = s.company ?? s.companyName ?? s.name ?? "—";
                const role = s.role ?? s.jobRole ?? s.branch ?? "—";
                const type = s.type ?? s.employmentType ?? s.status ?? "—";
                const tier = s.tier ?? s.branch ?? "—";
                const packageValue = s.package ?? s.ctc ?? "—";
                const location = s.location ?? s.workMode ?? "—";
                const appliedDate = s.appliedDate ?? s.appliedAt ?? s.date ?? "—";

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleSelect(id)}
                    className={`w-full grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-x-3 items-center px-4 py-3 text-left transition ${isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                      }`}
                  >
                    {/* Company */}
                    <span className="flex items-center gap-1.5 font-semibold text-sm text-gray-900">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                      </span>
                      {company}
                    </span>

                    {/* Role */}
                    <span className="text-sm text-gray-700 truncate">{role}</span>

                    {/* Type */}
                    <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${typeStyleMap[type] ?? "bg-gray-100 text-gray-600"}`}>
                      {type}
                    </span>

                    {/* Tier */}
                    <span className={`text-xs font-semibold ${tierStyleMap[tier] ?? "text-gray-500"}`}>{tier}</span>

                    {/* Package */}
                    <span className="text-sm font-medium text-gray-800">{packageValue}</span>

                    {/* Location */}
                    <span className="text-sm text-gray-600">{location}</span>

                    {/* Status */}
                    <span
                      className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${stageStyle?.color ?? "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                    >
                      {stageStyle?.label ?? s.stage}
                    </span>

                    {/* Applied Date */}
                    <span className="text-sm text-gray-500">{appliedDate}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop View (Pipeline Board) ── */}
      <div className="relative hidden h-full min-h-0 md:block">
        <div className="h-full w-full overflow-y-hidden overflow-x-hidden">
          <div className="grid h-full grid-cols-6 gap-3 px-2 pb-1 sm:gap-4 sm:px-4 lg:px-6">
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
