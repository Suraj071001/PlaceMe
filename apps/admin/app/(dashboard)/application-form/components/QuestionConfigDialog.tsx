import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { useState } from "react";

export default function QuestionConfigDialog({ open, setOpen, type, addQuestion }: any) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState(false);
  const [privateField, setPrivateField] = useState(false);

  function handleAdd() {
    if (!label.trim()) return;

    addQuestion({
      id: Date.now(),
      type,
      label,
      description,
      required,
      private: privateField,
    });

    setLabel("");
    setDescription("");
    setRequired(false);
    setPrivateField(false);

    setOpen(false);
  }

  const getAboutText = () => {
    switch (type) {
      case "Email":
        return "Only valid email addresses";
      case "Phone":
        return "Only domestic or international phone numbers";
      case "Short Answer":
        return "Single line of unformatted text. LinkedIn url responses will be auto-populated on the candidate's profile.";
      default:
        return "Valid input required";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px] p-0 gap-0 overflow-hidden flex flex-col">
        <div className="p-6 pb-4 shrink-0 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add {type}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-1">
              Question Label <span className="text-red-500">*</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-shadow"
              placeholder="Enter your question..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-slate-700">Description (Optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 focus:bg-white transition-colors"
              placeholder="Add additional context..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-[14px] text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={required}
                onChange={() => setRequired(!required)}
                className="w-[18px] h-[18px] rounded-[4px] border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-medium">Required</span>
            </label>

            <label className="flex items-center gap-3 text-[14px] text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={privateField}
                onChange={() => setPrivateField(!privateField)}
                className="w-[18px] h-[18px] rounded-[4px] border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span className="font-medium">Private</span>
                <span className="text-slate-500 text-[13px]">(Only visible to Organization Admins and users with Elevated Access)</span>
              </div>
            </label>
          </div>

          <div className="bg-[#f0f7ff] border border-blue-100 rounded-xl p-4 text-[14px]">
            <span className="font-bold text-blue-900">About {type}:</span> <span className="text-blue-800">{getAboutText()}</span>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-slate-100 shrink-0 bg-white flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 text-[14px] font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Back
          </button>

          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 text-[14px] font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="px-5 py-2 text-[14px] font-medium border border-transparent rounded-lg bg-[#6366f1] hover:bg-indigo-600 text-white transition-colors shadow-sm"
          >
            Add Question
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
