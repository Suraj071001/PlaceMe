"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { MessageSquare, HelpCircle, FileText } from "lucide-react";

const prepOptions = [
  {
    title: "Start Mock Interview",
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    title: "Practice MCQ Test",
    icon: HelpCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    title: "Previous Questions",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export function PrepareForInterviewsSection() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastOpen) return;
    const timer = setTimeout(() => {
      setToastOpen(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastOpen]);

  const showComingSoonToast = (title: string) => {
    setToastMessage(`${title} is coming soon`);
    setToastOpen(true);
  };

  return (
    <>
      <Card className="border-2 border-[#4f46e5]/20 bg-[#F8FAFC]/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            Prepare for Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {prepOptions.map((option) => (
              <button
                key={option.title}
                type="button"
                onClick={() => showComingSoonToast(option.title)}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white p-6 text-center transition-colors hover:bg-gray-50 hover:border-gray-200"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${option.bg} shadow-sm border border-white`}
                >
                  <option.icon className={`h-6 w-6 ${option.color}`} />
                </div>
                <span className="font-medium text-sm text-gray-900">
                  {option.title}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {toastOpen && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-indigo-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-lg">
          {toastMessage}
        </div>
      )}
    </>
  );
}
