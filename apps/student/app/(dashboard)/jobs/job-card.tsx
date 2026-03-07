"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

type Job = {
  id: string;
  company: string;
  role: string;
  salary: number;
  location: string;
  type: string;
  deadline: string;
  skills: string[];
  description: string;
  minCgpa: number;
  eligible: boolean;
};

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const salaryText = job.salary > 0 ? `₹ ${job.salary} LPA` : "Salary not disclosed";

  return (
    <Card className="py-4">
      <CardContent className="py-0">
        <div className="flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="min-w-0 flex-1 space-y-1.5">
            {/* Company + badge */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">{job.company}</h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${
                  job.eligible ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {job.eligible ? "Eligible" : "Not Eligible"}
              </span>
            </div>

            {/* Role */}
            <p className="text-sm font-medium text-muted-foreground">{job.role}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span>{salaryText}</span>
              <span>📍 {job.location}</span>
              <span>🏢 {job.type}</span>
              <span>📅 Apply by {job.deadline}</span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {skill}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground">{job.description}</p>

            {/* Min CGPA */}
            <p className="text-[11px] text-muted-foreground">Minimum CGPA: {job.minCgpa}</p>
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 flex-col gap-1.5">
            {job.eligible ? (
              <Button size="sm" className="min-w-[100px] bg-indigo-600 text-white hover:bg-indigo-700">
                Apply Now
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="min-w-[100px]">
                View Details
              </Button>
            )}
            <Button variant="outline" size="sm" className="min-w-[100px]">
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
