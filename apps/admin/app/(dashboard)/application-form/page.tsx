"use client";

import { useState } from "react";
import { defaultQuestions } from "../../components/data";
import { Search, ChevronDown, Plus, Pencil, ArrowLeft } from "lucide-react";

import QuestionCard, { Question } from "./components/QuestionCard";
import QuestionTypeDialog from "./components/QuestionDialogType";
import QuestionConfigDialog from "./components/QuestionConfigDialog";
import { useRouter } from "next/navigation";

const mockForms = [
  { id: 1, title: "Default Application Form", category: "Uncategorized" },
  { id: 2, title: "Driving Required Application Form", category: "Uncategorized" },
  { id: 3, title: "Application Form", category: "Uncategorized" },
  { id: 4, title: "CV for Opportunities", category: "Uncategorized" },
  { id: 5, title: "Engineer Application Form", category: "Engineering" },
  { id: 6, title: "Finance Director Application", category: "Uncategorized" },
  { id: 7, title: "General Interest", category: "Uncategorized" },
];

export default function ApplicationFormPage() {
  const [forms, setForms] = useState(mockForms);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions as Question[]);
  const [activeFormId, setActiveFormId] = useState(1);

  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const router = useRouter();

  function deleteQuestion(id: string | number) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  function handleTypeSelect(type: string) {
    setSelectedType(type);
    setTypeDialogOpen(false);
    setConfigDialogOpen(true);
  }

  function addQuestion(question: Question) {
    setQuestions([...questions, question]);
  }

  function handleNewForm() {
    const newForm = {
      id: Date.now(),
      title: "Untitled Application Form",
      category: "Uncategorized",
    };
    setForms([newForm, ...forms]);
    setActiveFormId(newForm.id);
    setQuestions(
      defaultQuestions.map((q, index) => ({
        ...q,
        id: Date.now() + index,
      })),
    );
  }

  function startEditingTitle() {
    setEditingTitleValue(activeForm?.title || "");
    setIsEditingTitle(true);
  }

  function saveTitle() {
    if (editingTitleValue.trim()) {
      setForms(forms.map((f) => (f.id === activeFormId ? { ...f, title: editingTitleValue.trim() } : f)));
    }
    setIsEditingTitle(false);
  }

  const activeForm = forms.find((f) => f.id === activeFormId);

  return (
    <div className="flex bg-[#f8fafc] h-[calc(100vh-64px)]">
      {/* LEFT SIDEBAR */}
      <div className="w-[340px] bg-white border-r flex flex-col h-full border-r-slate-200 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-10">
        <div className="p-4 border-b border-b-slate-100 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800 text-[15px]">Application Forms</h2>
            <button
              onClick={handleNewForm}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm  cursor-pointer"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search forms..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="flex justify-between items-center px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Active Forms</span>
            <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
              Active <ChevronDown size={14} />
            </button>
          </div>

          <div className="px-3 space-y-1.5 pb-4">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => setActiveFormId(form.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeFormId === form.id
                    ? "bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200 ring-1 ring-slate-900/5 relative overflow-hidden"
                    : "hover:bg-slate-100 border border-transparent"
                }`}
              >
                {activeFormId === form.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className={`font-semibold text-[14px] ${activeFormId === form.id ? "text-slate-900" : "text-slate-700"}`}>{form.title}</div>
                <div className="text-[12px] text-slate-500 mt-1 font-medium">{form.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT BUILDER EDITOR */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="max-w-[840px] mx-auto p-10">
          {/* EDITOR HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <ArrowLeft size={20} />
              </button>
              {isEditingTitle ? (
                <input
                  autoFocus
                  value={editingTitleValue}
                  onChange={(e) => setEditingTitleValue(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                    if (e.key === "Escape") setIsEditingTitle(false);
                  }}
                  className="text-xl font-semibold text-slate-900 border-b border-blue-500 focus:outline-none bg-transparent px-1 min-w-[250px]"
                />
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{activeForm?.title}</h1>
                  <button
                    onClick={startEditingTitle}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                    aria-label="Edit title"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              )}
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded ml-1">Default</span>
            </div>

            <div className="flex gap-2 items-center">
              <button className="bg-white border border-slate-200 px-4 py-2 rounded-md text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap  cursor-pointer">
                Save Draft
              </button>
              <button
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap  cursor-pointer"
                onClick={() => router.push("/review-publish-jobs")}
              >
                Continue <span className="text-slate-400 opacity-80">&rarr;</span>
              </button>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} deleteQuestion={deleteQuestion} />
            ))}
          </div>

          {/* ADD ACTIONS */}
          <div className="mt-6">
            <button
              onClick={() => setTypeDialogOpen(true)}
              className="w-full border border-dashed border-slate-300 bg-white text-slate-600 font-medium rounded-lg py-3 text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 shadow-sm  cursor-pointer"
            >
              <Plus size={16} className="text-slate-400" />
              Add new question
            </button>
          </div>
        </div>
      </div>

      <QuestionTypeDialog open={typeDialogOpen} setOpen={setTypeDialogOpen} onSelect={handleTypeSelect} />
      <QuestionConfigDialog open={configDialogOpen} setOpen={setConfigDialogOpen} type={selectedType} addQuestion={addQuestion} />
    </div>
  );
}
