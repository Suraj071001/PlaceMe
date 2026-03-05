"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Briefcase, Calendar, Clock, MapPin } from "lucide-react";

export type Application = {
    id: string;
    company: string;
    role: string;
    type: "Full-time" | "Internship";
    tier: "Dream" | "Tier 1" | "Tier 2";
    package: number;
    location: string;
    appliedDate: string;
    interviewDate?: string;
    status: string;
};

const tierColors: Record<string, { bg: string; text: string }> = {
    Dream: { bg: "bg-orange-50", text: "text-orange-600" },
    "Tier 1": { bg: "bg-blue-50", text: "text-blue-600" },
    "Tier 2": { bg: "bg-purple-50", text: "text-purple-600" },
};

const typeColors: Record<string, { bg: string; text: string }> = {
    "Full-time": { bg: "bg-emerald-50", text: "text-emerald-700" },
    Internship: { bg: "bg-cyan-50", text: "text-cyan-700" },
};

type ApplicationCardProps = {
    application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
    const tier = tierColors[application.tier] ?? tierColors["Tier 1"]!;
    const type = typeColors[application.type] ?? typeColors["Full-time"]!;

    return (
        <Card className="gap-0 border-gray-100 bg-white py-3 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="px-4 py-0">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                        <Briefcase className="h-4 w-4" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Company + Tier */}
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="truncate text-sm font-semibold text-gray-900">
                                {application.company}
                            </h4>
                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tier.bg} ${tier.text}`}
                            >
                                {application.tier}
                            </span>
                        </div>

                        {/* Role */}
                        <p className="truncate text-xs text-gray-600">
                            {application.role}
                        </p>

                        {/* Type + Package */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${type.bg} ${type.text}`}
                            >
                                {application.type}
                            </span>
                            <span className="text-[11px] font-medium text-gray-500">
                                ₹{application.package} LPA
                            </span>
                        </div>

                        {/* Location + Dates */}
                        <div className="space-y-0.5 pt-0.5">
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                <MapPin className="h-3 w-3" />
                                <span>{application.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>Applied: {application.appliedDate}</span>
                            </div>
                            {application.interviewDate && (
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <span>Interview: {application.interviewDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
