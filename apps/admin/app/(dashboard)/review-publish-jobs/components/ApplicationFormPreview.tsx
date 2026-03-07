import type { JobDraft } from "../../create-jobs/lib/jobDraft";

const labelFromType: Record<string, string> = {
  SHORT_TEXT: "Short Answer",
  LONG_TEXT: "Long Answer",
  EMAIL: "Email",
  PHONE: "Phone",
  YES_NO: "Yes/No",
  CHECKBOX: "Checkboxes",
  MULTIPLE_CHOICE: "Multiple Choice",
  DATE: "Date",
  FILE_UPLOAD: "File Upload",
  URL: "URL",
};

export default function ApplicationFormPreview({ draft }: { draft: JobDraft }) {
  const questions =
    draft.applicationForm?.sections?.flatMap((s) => s.questions ?? []) ??
    [];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Application Form</h2>
      <p className="text-sm text-slate-500 mb-4">{draft.applicationForm?.title ?? "Application Form"}</p>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="text-sm text-slate-500">No questions added.</div>
        ) : (
          questions.map((q, i) => (
          <div key={i} className="border rounded-md p-4 bg-slate-50 flex justify-between">
            <div>
              <p className="text-sm font-medium">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </p>

              <p className="text-xs text-slate-500">{labelFromType[String(q.type)] ?? String(q.type)}</p>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
