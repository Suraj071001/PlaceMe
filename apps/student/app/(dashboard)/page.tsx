"use client";

import { StatCard } from "./stat-card";
import { ProfileStrengthSection } from "./profile-strength-section";
import { UpcomingInterviewsSection } from "./upcoming-interviews-section";
import { ApplicationStatusSection } from "./application-status-section";
import { RecentNotificationsSection } from "./recent-notifications-section";
import { RecommendedJobsSection } from "./recommended-jobs-section";

/* ── Mock data ───────────────────────────────────────────── */

const stats = [
  { title: "Applications", value: 12, subtitle: "+3 this week", icon: "applications" as const },
  { title: "Shortlisted", value: 5, subtitle: "+2 new", icon: "shortlisted" as const },
  { title: "Interviews", value: 3, subtitle: "2 upcoming", icon: "interviews" as const },
  { title: "Profile Strength", value: "78%", subtitle: "+12% improvement", icon: "profile" as const },
];

const profileStrength = {
  percentage: 78,
  items: [
    { label: "Resume Added", completed: true },
    { label: "Skills Updated", completed: true },
    { label: "Add 2 Projects", completed: false },
  ],
};

const upcomingInterviews = [
  {
    company: "Google",
    role: "Software Engineer",
    type: "Technical" as const,
    date: "March 8, 2026",
    time: "10:00 AM",
  },
  {
    company: "Microsoft",
    role: "Product Manager",
    type: "HR" as const,
    date: "March 10, 2026",
    time: "2:30 PM",
  },
];

const applicationStatuses = [
  { label: "Applied", count: 12, icon: "applied" as const },
  { label: "Shortlisted", count: 5, icon: "shortlisted" as const },
  { label: "Selected", count: 1, icon: "selected" as const },
];

const recentNotifications = [
  {
    message: "New job posted: Full Stack Developer at Amazon",
    time: "2 hours ago",
    color: "blue" as const,
  },
  {
    message: "Application shortlisted for Meta - Software Engineer",
    time: "5 hours ago",
    color: "green" as const,
  },
  {
    message: "Resume score improved to 78%",
    time: "1 day ago",
    color: "green" as const,
  },
];

const recommendedJobs = [
  { company: "Amazon", role: "Full Stack Developer", salary: 25, location: "Bangalore", eligible: true },
  { company: "Flipkart", role: "Frontend Engineer", salary: 22, location: "Bangalore", eligible: true },
  { company: "Adobe", role: "Software Engineer", salary: 28, location: "Noida", eligible: false },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, John!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your placement dashboard overview
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Profile Strength */}
      <ProfileStrengthSection
        percentage={profileStrength.percentage}
        items={profileStrength.items}
      />

      {/* Interviews + Application Status (side-by-side) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <UpcomingInterviewsSection interviews={upcomingInterviews} />
        <ApplicationStatusSection statuses={applicationStatuses} />
      </div>

      {/* Recent Notifications */}
      <RecentNotificationsSection notifications={recentNotifications} />

      {/* Recommended Jobs */}
      <RecommendedJobsSection jobs={recommendedJobs} />
    </div>
  );
}
