"use client";

import { useEffect, useMemo, useState } from "react";
import { JobCard } from "./job-card";
import { JobFilterBar } from "./job-filter-bar";
import { getStudentJobs, type StudentJob } from "./job-api";

export default function JobsPage() {
    const [allJobs, setAllJobs] = useState<StudentJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: "",
        minCgpa: "",
        location: "",
        jobType: "",
        sortBy: "latest",
    });

    useEffect(() => {
        let mounted = true;

        const loadJobs = async () => {
            try {
                const jobs = await getStudentJobs();
                if (mounted) {
                    setAllJobs(jobs);
                    setError(null);
                }
            } catch (err) {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : "Failed to fetch jobs";
                setError(message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        loadJobs();
        return () => {
            mounted = false;
        };
    }, []);

    const locations = useMemo(() => [...new Set(allJobs.map((j) => j.location))], [allJobs]);
    const jobTypes = useMemo(() => [...new Set(allJobs.map((j) => j.type))], [allJobs]);

    const filteredJobs = useMemo(() => {
        let result = allJobs.filter((job) => {
            // Search
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matchesSearch =
                    job.company.toLowerCase().includes(q) ||
                    job.role.toLowerCase().includes(q) ||
                    job.skills.some((s) => s.toLowerCase().includes(q));
                if (!matchesSearch) return false;
            }

            // Min CGPA
            if (filters.minCgpa && job.minCgpa < parseFloat(filters.minCgpa)) {
                return false;
            }

            // Location
            if (filters.location && job.location !== filters.location) {
                return false;
            }

            // Job type
            if (filters.jobType && job.type !== filters.jobType) {
                return false;
            }

            return true;
        });

        // Sort
        switch (filters.sortBy) {
            case "salary-high":
                result = [...result].sort((a, b) => b.salary - a.salary);
                break;
            case "salary-low":
                result = [...result].sort((a, b) => a.salary - b.salary);
                break;
            case "deadline":
                result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
                break;
            default:
                break;
        }

        return result;
    }, [filters]);

    return (
        <div className="mx-auto max-w-6xl space-y-4 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Job Opportunities</h1>
                <p className="text-muted-foreground">Discover and apply for placement opportunities</p>
            </div>

            <JobFilterBar
                filters={filters}
                onFilterChange={setFilters}
                resultCount={filteredJobs.length}
                locations={locations}
                jobTypes={jobTypes}
            />

            {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading job opportunities...</div>
            ) : error ? (
                <div className="py-12 text-center text-red-600">{error}</div>
            ) : filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                    No jobs match your filters. Try adjusting your criteria.
                </div>
            ) : (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
        </div>
    );
}
