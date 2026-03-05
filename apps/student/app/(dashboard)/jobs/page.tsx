"use client";

import { useState, useMemo } from "react";
import { JobCard } from "./job-card";
import { JobFilterBar } from "./job-filter-bar";

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

const allJobs: Job[] = [
    {
        id: "1",
        company: "Google",
        role: "Software Engineer",
        salary: 35,
        location: "Bangalore",
        type: "Full-time",
        deadline: "March 15, 2026",
        skills: ["React", "Node.js", "Python"],
        description: "Join our engineering team to build scalable solutions",
        minCgpa: 8,
        eligible: true,
    },
    {
        id: "2",
        company: "Microsoft",
        role: "Product Manager",
        salary: 32,
        location: "Hyderabad",
        type: "Full-time",
        deadline: "March 20, 2026",
        skills: ["Product Strategy", "Analytics"],
        description: "Lead product development for cloud services",
        minCgpa: 7.5,
        eligible: true,
    },
    {
        id: "3",
        company: "Meta",
        role: "Data Scientist",
        salary: 40,
        location: "Remote",
        type: "Full-time",
        deadline: "March 12, 2026",
        skills: ["Python", "ML", "Statistics"],
        description: "Work on cutting-edge ML models",
        minCgpa: 8.5,
        eligible: false,
    },
    {
        id: "4",
        company: "Netflix",
        role: "Backend Engineer",
        salary: 38,
        location: "Mumbai",
        type: "Full-time",
        deadline: "March 25, 2026",
        skills: ["Java", "Microservices", "Kafka"],
        description: "Scale streaming infrastructure globally",
        minCgpa: 8,
        eligible: true,
    },
    {
        id: "5",
        company: "Adobe",
        role: "UX Designer",
        salary: 24,
        location: "Noida",
        type: "Full-time",
        deadline: "March 22, 2026",
        skills: ["Figma", "UI/UX", "Design Systems"],
        description: "Design beautiful user experiences",
        minCgpa: 7.5,
        eligible: false,
    },
    {
        id: "6",
        company: "Amazon",
        role: "Cloud Engineer",
        salary: 30,
        location: "Bangalore",
        type: "Full-time",
        deadline: "March 30, 2026",
        skills: ["AWS", "Kubernetes", "Terraform"],
        description: "Build and maintain cloud infrastructure at scale",
        minCgpa: 7,
        eligible: true,
    },
];

export default function JobsPage() {
    const [filters, setFilters] = useState({
        search: "",
        minCgpa: "",
        location: "",
        jobType: "",
        sortBy: "latest",
    });

    const locations = useMemo(() => [...new Set(allJobs.map((j) => j.location))], []);
    const jobTypes = useMemo(() => [...new Set(allJobs.map((j) => j.type))], []);

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

            {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                    No jobs match your filters. Try adjusting your criteria.
                </div>
            ) : (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
        </div>
    );
}
