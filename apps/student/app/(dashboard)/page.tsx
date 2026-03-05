"use client";

import { PlacementProgressSection } from "./placement-progress-section";
import { NextImportantActionsSection, type NextAction } from "./next-important-actions-section";
import { EligibleCompaniesSection, type EligibleCompany } from "./eligible-companies-section";
import { PrepareForInterviewsSection } from "./prepare-for-interviews-section";

/* ── Mock data ───────────────────────────────────────────── */

const placementProgress = [
  { title: "Applications", value: 6, icon: "applications" as const },
  { title: "Shortlisted", value: 2, icon: "shortlisted" as const },
  { title: "Interviews", value: 1, icon: "interviews" as const },
];

const nextActions: NextAction[] = [
  {
    id: "1",
    type: "assessment",
    title: "Online Assessment",
    status: "Urgent",
    company: "Amazon",
    date: "Tomorrow",
    time: "10:00 AM",
  },
  {
    id: "2",
    type: "technical",
    title: "Technical Round",
    status: "Scheduled",
    company: "Google",
    date: "March 8, 2026",
    time: "2:30 PM",
  },
  {
    id: "3",
    type: "resume",
    title: "Upload Resume",
    status: "Pending",
    company: "Microsoft",
    date: "March 6, 2026",
    time: "End of Day",
  },
];

const eligibleCompanies: EligibleCompany[] = [
  {
    id: "1",
    name: "Amazon",
    role: "Software Engineer",
    salary: "₹25 LPA",
    location: "Bangalore",
    status: "New",
  },
  {
    id: "2",
    name: "Flipkart",
    role: "Frontend Engineer",
    salary: "₹22 LPA",
    location: "Bangalore",
    status: "Closing Soon",
  },
  {
    id: "3",
    name: "Adobe",
    role: "Full Stack Developer",
    salary: "₹28 LPA",
    location: "Noida",
    status: "New",
  },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, John
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s your placement progress overview
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-6">
        <PlacementProgressSection stats={placementProgress} />

        <NextImportantActionsSection actions={nextActions} />

        <EligibleCompaniesSection companies={eligibleCompanies} />

        <PrepareForInterviewsSection />
      </div>
    </div>
  );
}
