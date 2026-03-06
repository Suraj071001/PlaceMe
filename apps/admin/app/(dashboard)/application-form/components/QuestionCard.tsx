import { GripVertical, FileText, Trash2, Mail, Phone, AlignLeft, Paperclip, X } from "lucide-react";
import { useState } from "react";

export default function QuestionCard({ question, deleteQuestion }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
  };
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail size={16} className="text-slate-400" />;
      case "phone":
        return <Phone size={16} className="text-slate-400" />;
      case "short":
        return <FileText size={16} className="text-slate-400" />;
      case "long":
        return <AlignLeft size={16} className="text-slate-400" />;
      case "file":
      case "File Upload":
        return <Paperclip size={16} className="text-slate-400" />;
      default:
        return <FileText size={16} className="text-slate-400" />;
    }
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "email":
        return "user@example.com...";
      case "phone":
        return "+1 (555) 000-0000";
      case "file":
      case "File Upload":
        return "Drag or upload file...";
      default:
        return "Short Answer...";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group/card">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <GripVertical size={16} className="text-slate-300 mt-1 cursor-grab shrink-0 hover:text-slate-400 transition-colors" />
          <div className="flex items-center gap-2 mt-1 shrink-0 bg-slate-50 rounded border border-slate-100 p-1">{getIcon(question.type)}</div>
          <div>
            <div className="font-medium text-[14px] flex items-center gap-1.5 text-slate-900 tracking-tight">
              {question.label}
              {question.required && <span className="text-red-500 font-bold">*</span>}
            </div>
            <button className="text-blue-500 hover:text-blue-600 text-[13px] font-medium mt-0.5 transition-colors">Add description</button>
          </div>
        </div>
        <button
          onClick={() => deleteQuestion(question.id)}
          className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md shrink-0 transition-opacity opacity-0 group-hover/card:opacity-100 focus:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="ml-10 pr-6">
        {question.type === "file" || question.type === "File Upload" ? (
          <div className="w-full border border-dashed border-slate-300 rounded-lg p-6 text-center text-sm text-slate-500 bg-slate-50 mt-4 relative overflow-hidden group cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-colors">
            {selectedFile ? (
              <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-md z-20 relative shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-red-50 rounded">
                    <FileText size={18} className="text-red-500" />
                  </div>
                  <span className="font-medium text-slate-700 truncate max-w-[200px] text-[13px]">{selectedFile.name}</span>
                </div>
                <button onClick={removeFile} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center gap-2 relative z-0">
                  <div className="p-2 bg-white rounded shadow-sm border border-slate-100 group-hover:border-slate-300 transition-colors">
                    <Paperclip size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors relative z-0" />
                  </div>
                  <span className="font-medium text-slate-600 text-[13px]">Drag or click to upload file...</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <input
            disabled
            placeholder={getPlaceholder(question.type)}
            className="mt-4 w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50/50 text-[13px] text-slate-500 placeholder:text-slate-400/80 shadow-sm focus:outline-none"
          />
        )}

        <label className="flex items-center gap-2.5 mt-5 text-[13px] font-medium text-slate-700 cursor-pointer w-fit">
          <input
            type="checkbox"
            defaultChecked={question.required}
            className="rounded-[4px] border-slate-300 text-blue-600 focus:ring-blue-500 w-[15px] h-[15px] cursor-pointer"
          />
          Required?
        </label>
      </div>
    </div>
  );
}
