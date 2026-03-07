import { GripVertical, FileText, Trash2, Mail, Phone, AlignLeft, Link } from "lucide-react";

export interface Question {
  id: string | number;
  type: string;
  label?: string;
  required?: boolean;
}

interface QuestionCardProps {
  question: Question;
  deleteQuestion: (id: string | number) => void;
}

export default function QuestionCard({ question, deleteQuestion }: QuestionCardProps) {
  const isResumeField = question.type === "Resume Link" || question.label?.toLowerCase().includes("resume");

  const getIcon = (type: string) => {
    if (isResumeField) return <Link size={16} className="text-slate-400" />;

    switch (type) {
      case "Email":
        return <Mail size={16} className="text-slate-400" />;
      case "Phone":
        return <Phone size={16} className="text-slate-400" />;
      case "Short Answer":
        return <FileText size={16} className="text-slate-400" />;
      case "Long Unformatted Answer":
        return <AlignLeft size={16} className="text-slate-400" />;
      default:
        return <FileText size={16} className="text-slate-400" />;
    }
  };

  const getPlaceholder = (type: string) => {
    if (isResumeField) return "https://drive.google.com/your-resume-link";

    switch (type) {
      case "Email":
        return "user@example.com...";
      case "Phone":
        return "+91 9876543210";
      default:
        return "Short Answer...";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group/card">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <GripVertical size={16} className="text-slate-300 mt-1 cursor-grab shrink-0" />

          <div className="flex items-center gap-2 mt-1 shrink-0 bg-slate-50 rounded border border-slate-100 p-1">{getIcon(question.type)}</div>

          <div>
            <div className="font-medium text-[14px] flex items-center gap-1.5 text-slate-900">
              {question.label}
              {question.required && <span className="text-red-500 font-bold">*</span>}
            </div>

            <button className="text-blue-500 text-[13px] font-medium mt-0.5">Add description</button>
          </div>
        </div>

        <button
          onClick={() => deleteQuestion(question.id)}
          className="text-slate-300 hover:text-red-500 p-1.5 rounded-md opacity-0 group-hover/card:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="ml-0 pr-0 sm:ml-10 sm:pr-6">
        <input
          disabled
          type={isResumeField ? "url" : "text"}
          placeholder={getPlaceholder(question.type)}
          className="mt-4 w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-[13px]"
        />

        <label className="flex items-center gap-2.5 mt-5 text-[13px] font-medium text-slate-700 cursor-pointer w-fit">
          <input type="checkbox" defaultChecked={question.required} className="rounded border-slate-300 text-blue-600 w-[15px] h-[15px]" />
          Required?
        </label>
      </div>
    </div>
  );
}
