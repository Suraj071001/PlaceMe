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
    <div
      style={{
        display: "flex",
        gap: 0,
        maxWidth: 1200,
        margin: "18px auto 0",
      }}
    >
      {tabs.map((t) => {
        const isActive = activeTab === t.key;

        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#2563eb" : "#64748b",
              background: "none",
              border: "none",
              borderBottom: isActive ? "2.5px solid #2563eb" : "2.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {t.icon} {t.label}
          </button>
        );
      })}
    </div>
  );
}
