"use client";

import { useState } from "react";
import CreateJobHeader from "./components/JobHeader";
import CreateJobTabs from "./components/JobTabs";
import { JobDetailsTab } from "./components/JobDetailsTab";
import { DescriptionTab } from "./components/DescriptionTab";
import { SettingsTab } from "./components/SettingsTab";

export type TabKey = "details" | "description" | "settings";

export default function CreateJobPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <CreateJobHeader />

      <CreateJobTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px 60px" }}>
        {activeTab === "details" && <JobDetailsTab />}
        {activeTab === "description" && <DescriptionTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
