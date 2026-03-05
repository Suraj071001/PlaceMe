"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Calendar, Clock } from "lucide-react";

type Interview = {
    company: string;
    role: string;
    type: "Technical" | "HR";
    date: string;
    time: string;
};

type UpcomingInterviewsSectionProps = {
    interviews: Interview[];
};

const typeBadge: Record<string, { bg: string; text: string }> = {
    Technical: { bg: "bg-indigo-100", text: "text-indigo-700" },
    HR: { bg: "bg-blue-100", text: "text-blue-700" },
};

export function UpcomingInterviewsSection({
    interviews,
}: UpcomingInterviewsSectionProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-5 shadow-sm h-full">
            <CardContent className="space-y-4 px-5 py-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Upcoming Interviews
                    </h3>
                    <a
                        href="/applications"
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600"
                    >
                        View All
                    </a>
                </div>

                {/* Interview list */}
                <div className="space-y-4">
                    {interviews.map((interview, idx) => {
                        const badge =
                            typeBadge[interview.type] ?? typeBadge["Technical"]!;
                        return (
                            <div
                                key={idx}
                                className={`space-y-1.5 ${idx < interviews.length - 1 ? "border-b border-gray-50 pb-4" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {interview.company}
                                    </h4>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
                                    >
                                        {interview.type}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{interview.role}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {interview.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {interview.time}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
