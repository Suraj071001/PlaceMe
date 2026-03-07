import type { JobDraft } from "../../create-jobs/lib/jobDraft";

export default function JobSummary({ draft }: { draft: JobDraft }) {
  const job = {
    company: draft.companyName ?? "-",
    role: draft.role ?? draft.title ?? "-",
    type:
      draft.employmentType === "FULL_TIME"
        ? "Full-Time"
        : draft.employmentType === "PART_TIME"
          ? "Part-Time"
          : draft.employmentType === "CONTRACT"
            ? "Contract"
            : draft.employmentType === "TEMPORARY"
              ? "Temporary"
              : draft.employmentType === "INTERNSHIP"
                ? "Internship"
                : "-",
    location: (draft as any).location ?? "-",
    tier: draft.tier === "BASIC" ? "Basic" : draft.tier === "STANDARD" ? "Standard" : draft.tier === "DREAM" ? "Dream" : "-",
    package: draft.ctc ?? "-",
    deadline: draft.closeAt ? new Date(draft.closeAt).toDateString() : "-",
    departments: (draft.departmentNames ?? []).join(", ") || "-",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Job Information</h2>

      <div className="grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-slate-500">Company</p>
          <p className="font-medium">{job.company}</p>
        </div>

        <div>
          <p className="text-slate-500">Role</p>
          <p className="font-medium">{job.role}</p>
        </div>

        <div>
          <p className="text-slate-500">Job Type</p>
          <p className="font-medium">{job.type}</p>
        </div>

        <div>
          <p className="text-slate-500">Location</p>
          <p className="font-medium">{job.location}</p>
        </div>

        <div>
          <p className="text-slate-500">Tier</p>
          <p className="font-medium">{job.tier}</p>
        </div>

        <div>
          <p className="text-slate-500">Package</p>
          <p className="font-medium">{job.package}</p>
        </div>

        <div>
          <p className="text-slate-500">Deadline</p>
          <p className="font-medium">{job.deadline}</p>
        </div>

        <div>
          <p className="text-slate-500">Eligible Departments</p>
          <p className="font-medium">{job.departments}</p>
        </div>
      </div>
    </div>
  );
}
