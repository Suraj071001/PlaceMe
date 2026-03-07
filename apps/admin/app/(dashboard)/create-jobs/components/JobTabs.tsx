"use client";

import { FileText, AlignLeft, Settings } from "lucide-react";
import { TabKey } from "../page";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "details", label: "Job Details", icon: <FileText size={15} /> },
  { key: "description", label: "Description", icon: <AlignLeft size={15} /> },
  { key: "settings", label: "Settings", icon: <Settings size={15} /> },
];

export default function CreateJobTabs({ activeTab, setActiveTab }: { activeTab: TabKey; setActiveTab: (tab: TabKey) => void }) {
  return (
    <div className="mx-auto mt-3 w-full max-w-[1200px] overflow-x-auto px-3 sm:mt-4 sm:px-5 lg:px-8">
      <div className="flex min-w-max gap-0 border-b border-slate-200">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex min-w-[150px] items-center justify-center gap-1.5 border-b-2 px-4 py-2 text-sm transition-colors ${
                isActive ? "border-blue-600 font-semibold text-blue-600" : "border-transparent font-medium text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
