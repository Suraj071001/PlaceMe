"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Building2, CheckCircle2, TrendingUp } from "lucide-react";

type StatusItem = {
    label: string;
    count: number;
    icon: "applied" | "shortlisted" | "selected";
};

type ApplicationStatusSectionProps = {
    statuses: StatusItem[];
};

const iconConfig: Record<
    StatusItem["icon"],
    { Icon: typeof Building2; bg: string; text: string }
> = {
    applied: { Icon: Building2, bg: "bg-indigo-50", text: "text-indigo-500" },
    shortlisted: {
        Icon: CheckCircle2,
        bg: "bg-emerald-50",
        text: "text-emerald-500",
    },
    selected: { Icon: TrendingUp, bg: "bg-purple-50", text: "text-purple-500" },
};

export function ApplicationStatusSection({
    statuses,
}: ApplicationStatusSectionProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-5 shadow-sm h-full">
            <CardContent className="space-y-4 px-5 py-0">
                <h3 className="text-base font-semibold text-gray-900">
                    Application Status
                </h3>

                <div className="space-y-3">
                    {statuses.map((status) => {
                        const config = iconConfig[status.icon];
                        return (
                            <div
                                key={status.label}
                                className="flex items-center gap-3 rounded-lg border border-gray-50 bg-gray-50/50 px-4 py-3"
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}
                                >
                                    <config.Icon className={`h-4 w-4 ${config.text}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{status.label}</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {status.count}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
