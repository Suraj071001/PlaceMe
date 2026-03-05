"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

type JobFilters = {
    search: string;
    minCgpa: string;
    location: string;
    jobType: string;
    sortBy: string;
};

type JobFilterBarProps = {
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
    resultCount: number;
    locations: string[];
    jobTypes: string[];
};

export function JobFilterBar({ filters, onFilterChange, resultCount, locations, jobTypes }: JobFilterBarProps) {
    const update = (key: keyof JobFilters, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({ search: "", minCgpa: "", location: "", jobType: "", sortBy: "latest" });
    };

    return (
        <div className="space-y-3">
            <Card>
                <CardContent className="space-y-4 pt-5 pb-5">
                    {/* Search bar */}
                    <Input
                        placeholder="Search by company, role, or skills..."
                        value={filters.search}
                        onChange={(e) => update("search", e.target.value)}
                        className="h-10"
                    />

                    {/* Filters row */}
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="min-w-[140px] flex-1">
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Min CGPA</label>
                            <select
                                value={filters.minCgpa}
                                onChange={(e) => update("minCgpa", e.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All</option>
                                <option value="6">6+</option>
                                <option value="7">7+</option>
                                <option value="7.5">7.5+</option>
                                <option value="8">8+</option>
                                <option value="8.5">8.5+</option>
                                <option value="9">9+</option>
                            </select>
                        </div>

                        <div className="min-w-[140px] flex-1">
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Location</label>
                            <select
                                value={filters.location}
                                onChange={(e) => update("location", e.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All Locations</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[140px] flex-1">
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Job Type</label>
                            <select
                                value={filters.jobType}
                                onChange={(e) => update("jobType", e.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">All Types</option>
                                {jobTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <Button variant="outline" onClick={clearFilters} className="h-9 gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Result count + Sort */}
            <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                    Showing {resultCount} opportunit{resultCount === 1 ? "y" : "ies"}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Sort by:</span>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => update("sortBy", e.target.value)}
                        className="rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                        <option value="latest">Latest</option>
                        <option value="salary-high">Salary: High to Low</option>
                        <option value="salary-low">Salary: Low to High</option>
                        <option value="deadline">Deadline</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
