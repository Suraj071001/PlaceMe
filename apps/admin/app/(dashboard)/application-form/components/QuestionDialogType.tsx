import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";

const types = [
  {
    label: "Short Answer",
    desc: "Single line of unformatted text. LinkedIn url responses will be auto-populated on the candidate's profile.",
  },
  {
    label: "Long Unformatted Answer",
    desc: "Multiple lines of unformatted text",
  },
  {
    label: "Phone",
    desc: "Only domestic or international phone numbers",
  },
  {
    label: "Email",
    desc: "Only valid email addresses",
  },
  {
    label: "Multiple Choice",
    desc: "Select a single option",
  },
  {
    label: "Checkboxes",
    desc: "Select multiple options",
  },
  {
    label: "Date",
    desc: "Only dates that can be selected via a date picker",
  },
  {
    label: "Yes/No",
    desc: "Yes, no, or, if not required, no answer",
  },
  {
    label: "File Upload",
    desc: "Upload documents",
  },
];

export default function QuestionTypeDialog({ open, setOpen, onSelect }: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px] p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Question</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 mt-6">Select a question type to add to your form</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          <div className="space-y-3">
            {types.map((t) => (
              <div
                key={t.label}
                onClick={() => onSelect(t.label)}
                className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="font-semibold text-[15px] text-slate-900 mb-1">{t.label}</div>
                <div className="text-[13px] text-slate-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-slate-100 shrink-0 bg-white flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
