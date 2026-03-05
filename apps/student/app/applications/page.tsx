"use client";

import { useMemo } from "react";
import { ApplicationStatusCard } from "./application-status-card";
import { ApplicationColumn } from "./application-column";
import type { Application } from "./application-card";

const STATUSES = [
    "Applied",
    "Online Assessment",
    "Technical Interview",
    "HR Interview",
    "Selected",
    "Rejected",
] as const;

const allApplications: Application[] = [
    {
        id: "1",
        company: "Meta",
        role: "Data Scientist",
        appliedDate: "Feb 25, 2026",
        status: "Applied",
    },
    {
        id: "2",
        company: "Adobe",
        role: "UX Designer",
        appliedDate: "Feb 28, 2026",
        status: "Applied",
    },
    {
        id: "3",
        company: "Amazon",
        role: "Full Stack Developer",
        appliedDate: "Feb 20, 2026",
        status: "Online Assessment",
    },
    {
        id: "4",
        company: "Google",
        role: "Software Engineer",
        appliedDate: "Feb 15, 2026",
        interviewDate: "Mar 8, 2026",
        status: "Technical Interview",
    },
    {
        id: "5",
        company: "Netflix",
        role: "Backend Engineer",
        appliedDate: "Feb 22, 2026",
        interviewDate: "Mar 12, 2026",
        status: "Technical Interview",
    },
    {
        id: "6",
        company: "Microsoft",
        role: "Product Manager",
        appliedDate: "Feb 18, 2026",
        interviewDate: "Mar 10, 2026",
        status: "HR Interview",
    },
    {
        id: "7",
        company: "Apple",
        role: "iOS Developer",
        appliedDate: "Jan 10, 2026",
        status: "Selected",
    },
    {
        id: "8",
        company: "Tesla",
        role: "Software Engineer",
        appliedDate: "Jan 15, 2026",
        status: "Rejected",
    },
];

export default function ApplicationsPage() {
    const grouped = useMemo(() => {
        const map: Record<string, Application[]> = {};
        for (const status of STATUSES) {
            map[status] = [];
        }
        for (const app of allApplications) {
            const bucket = map[app.status];
            if (bucket) {
                bucket.push(app);
            }
        }
        return map;
    }, []);

    return (
        <div className="min-w-0 space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Application Tracking</h1>
                <p className="text-muted-foreground">Track your application status and progress</p>
            </div>

            {/* Summary bar */}
            <div className="flex flex-wrap gap-3">
                {STATUSES.map((status) => (
                    <ApplicationStatusCard
                        key={status}
                        count={grouped[status]?.length ?? 0}
                        label={status}
                    />
                ))}
            </div>

            {/* Kanban columns */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {STATUSES.map((status) => (
                    <ApplicationColumn
                        key={status}
                        status={status}
                        applications={grouped[status] ?? []}
                    />
                ))}
            </div>
        </div>
    );
}
