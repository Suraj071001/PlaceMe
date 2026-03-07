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
    <div className="min-h-screen bg-[#f5f7fb]">
      <CreateJobHeader />

      <CreateJobTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mx-auto w-full max-w-[1200px] px-3 pb-10 pt-6 sm:px-5 lg:px-8">
        {activeTab === "details" && <JobDetailsTab />}
        {activeTab === "description" && <DescriptionTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
