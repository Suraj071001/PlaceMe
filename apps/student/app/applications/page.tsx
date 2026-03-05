"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, Filter, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { ApplicationStatusCard } from "./application-status-card";
import { ApplicationColumn } from "./application-column";
import { ApplicationListView } from "./application-list-view";
import {
    ApplicationFilterBar,
    defaultFilters,
    type ApplicationFilters,
} from "./application-filter-bar";
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
        type: "Full-time",
        tier: "Dream",
        package: 40,
        location: "Gurgaon",
        appliedDate: "Feb 25, 2026",
        status: "Applied",
    },
    {
        id: "2",
        company: "Adobe",
        role: "UX Designer",
        type: "Full-time",
        tier: "Tier 1",
        package: 24,
        location: "Noida",
        appliedDate: "Feb 28, 2026",
        status: "Applied",
    },
    {
        id: "3",
        company: "Paytm",
        role: "Backend Intern",
        type: "Internship",
        tier: "Tier 2",
        package: 0.8,
        location: "Noida",
        appliedDate: "Mar 2, 2026",
        status: "Applied",
    },
    {
        id: "4",
        company: "Amazon",
        role: "Full Stack Developer",
        type: "Full-time",
        tier: "Tier 1",
        package: 28,
        location: "Bangalore",
        appliedDate: "Feb 20, 2026",
        status: "Online Assessment",
    },
    {
        id: "5",
        company: "Flipkart",
        role: "Software Development Intern",
        type: "Internship",
        tier: "Tier 1",
        package: 1.2,
        location: "Bangalore",
        appliedDate: "Mar 1, 2026",
        status: "Online Assessment",
    },
    {
        id: "6",
        company: "Google",
        role: "Software Engineer",
        type: "Full-time",
        tier: "Dream",
        package: 45,
        location: "Bangalore",
        appliedDate: "Feb 15, 2026",
        interviewDate: "Mar 8, 2026",
        status: "Technical Interview",
    },
    {
        id: "7",
        company: "Netflix",
        role: "Backend Engineer",
        type: "Full-time",
        tier: "Tier 1",
        package: 32,
        location: "Mumbai",
        appliedDate: "Feb 22, 2026",
        interviewDate: "Mar 12, 2026",
        status: "Technical Interview",
    },
    {
        id: "8",
        company: "Microsoft",
        role: "Product Manager",
        type: "Full-time",
        tier: "Dream",
        package: 42,
        location: "Hyderabad",
        appliedDate: "Feb 18, 2026",
        interviewDate: "Mar 10, 2026",
        status: "HR Interview",
    },
    {
        id: "9",
        company: "Zomato",
        role: "Product Analyst",
        type: "Full-time",
        tier: "Tier 1",
        package: 18,
        location: "Gurgaon",
        appliedDate: "Feb 10, 2026",
        interviewDate: "Mar 5, 2026",
        status: "HR Interview",
    },
    {
        id: "10",
        company: "Swiggy",
        role: "Data Analyst Intern",
        type: "Internship",
        tier: "Tier 1",
        package: 1,
        location: "Bangalore",
        appliedDate: "Feb 12, 2026",
        status: "HR Interview",
    },
    {
        id: "11",
        company: "Apple",
        role: "iOS Developer",
        type: "Full-time",
        tier: "Dream",
        package: 48,
        location: "Bangalore",
        appliedDate: "Jan 10, 2026",
        status: "Selected",
    },
    {
        id: "12",
        company: "Tesla",
        role: "Software Engineer",
        type: "Full-time",
        tier: "Dream",
        package: 35,
        location: "Pune",
        appliedDate: "Jan 15, 2026",
        status: "Rejected",
    },
];

export default function ApplicationsPage() {
    const [view, setView] = useState<"pipeline" | "list">("pipeline");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);

    const locations = useMemo(
        () => [...new Set(allApplications.map((a) => a.location))],
        []
    );

    const filteredApplications = useMemo(() => {
        return allApplications.filter((app) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (
                    !app.company.toLowerCase().includes(q) &&
                    !app.role.toLowerCase().includes(q)
                )
                    return false;
            }
            if (filters.jobType && app.type !== filters.jobType) return false;
            if (filters.status && app.status !== filters.status) return false;
            if (filters.tier && app.tier !== filters.tier) return false;
            if (filters.location && app.location !== filters.location) return false;
            if (filters.minPackage && app.package < parseFloat(filters.minPackage))
                return false;
            if (filters.maxPackage && app.package > parseFloat(filters.maxPackage))
                return false;
            if (filters.appliedFrom) {
                const from = new Date(filters.appliedFrom);
                const applied = new Date(app.appliedDate);
                if (applied < from) return false;
            }
            if (filters.appliedTo) {
                const to = new Date(filters.appliedTo);
                const applied = new Date(app.appliedDate);
                if (applied > to) return false;
            }
            return true;
        });
    }, [filters]);

    const grouped = useMemo(() => {
        const map: Record<string, Application[]> = {};
        for (const status of STATUSES) {
            map[status] = [];
        }
        for (const app of filteredApplications) {
            const bucket = map[app.status];
            if (bucket) {
                bucket.push(app);
            }
        }
        return map;
    }, [filteredApplications]);

    return (
        <div className="min-w-0 space-y-5 pb-10">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Application Tracking
                    </h1>
                    <p className="text-muted-foreground">
                        Track your application status and progress
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Pipeline / List toggle */}
                    <div className="flex overflow-hidden rounded-lg border border-gray-200">
                        <button
                            onClick={() => setView("pipeline")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${view === "pipeline"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Pipeline
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`flex items-center gap-1.5 border-l px-3 py-1.5 text-xs font-medium transition-colors ${view === "list"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <List className="h-3.5 w-3.5" />
                            List
                        </button>
                    </div>

                    {/* Filters toggle */}
                    <Button
                        variant={filtersOpen ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className={`gap-1.5 ${filtersOpen
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : ""
                            }`}
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Filters
                        {filtersOpen && <ChevronUp className="h-3.5 w-3.5" />}
                    </Button>
                </div>
            </div>

            {/* Filter bar */}
            <ApplicationFilterBar
                filters={filters}
                onFilterChange={setFilters}
                isOpen={filtersOpen}
                statuses={[...STATUSES]}
                locations={locations}
            />

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

            {/* Content */}
            {view === "pipeline" ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {STATUSES.map((status) => (
                        <ApplicationColumn
                            key={status}
                            status={status}
                            applications={grouped[status] ?? []}
                        />
                    ))}
                </div>
            ) : (
                <ApplicationListView applications={filteredApplications} />
            )}
        </div>
    );
}
