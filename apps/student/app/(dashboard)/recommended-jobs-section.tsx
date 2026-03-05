"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";

type RecommendedJob = {
    company: string;
    role: string;
    salary: number;
    location: string;
    eligible: boolean;
};

type RecommendedJobsSectionProps = {
    jobs: RecommendedJob[];
};

export function RecommendedJobsSection({ jobs }: RecommendedJobsSectionProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-5 shadow-sm">
            <CardContent className="space-y-4 px-5 py-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Recommended Jobs
                    </h3>
                    <a
                        href="/jobs"
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
                    >
                        View All <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                {/* Job cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {jobs.map((job, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 space-y-3"
                        >
                            {/* Company + badge */}
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {job.company}
                                    </h4>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${job.eligible
                                                ? "bg-green-50 text-green-600 border border-green-200"
                                                : "bg-red-50 text-red-500 border border-red-200"
                                            }`}
                                    >
                                        {job.eligible ? "Eligible" : "Not Eligible"}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-gray-500">{job.role}</p>

                                <div className="mt-2 space-y-0.5">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₹ {job.salary} LPA
                                    </p>
                                    <p className="text-xs text-gray-400">{job.location}</p>
                                </div>
                            </div>

                            {/* Action */}
                            {job.eligible ? (
                                <Button
                                    size="sm"
                                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Apply Now
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" className="w-full">
                                    View Details
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
