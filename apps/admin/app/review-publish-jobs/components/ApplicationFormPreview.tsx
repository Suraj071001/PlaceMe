export default function ApplicationFormPreview() {
  const questions = [
    { label: "Name", type: "Short Answer", required: true },
    { label: "Email", type: "Email", required: true },
    { label: "Resume", type: "File Upload", required: true },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Application Form</h2>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="border rounded-md p-4 bg-slate-50 flex justify-between">
            <div>
              <p className="text-sm font-medium">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </p>

              <p className="text-xs text-slate-500">{q.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
