"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import {
    Building2,
    CheckCircle2,
    CalendarDays,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle: string;
    icon: "applications" | "shortlisted" | "interviews" | "profile";
};

const iconConfig: Record<
    StatCardProps["icon"],
    { Icon: LucideIcon; bg: string; text: string }
> = {
    applications: { Icon: Building2, bg: "bg-indigo-50", text: "text-indigo-500" },
    shortlisted: { Icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-500" },
    interviews: { Icon: CalendarDays, bg: "bg-orange-50", text: "text-orange-500" },
    profile: { Icon: TrendingUp, bg: "bg-teal-50", text: "text-teal-500" },
};

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
    const { Icon, bg, text } = iconConfig[icon];

    return (
        <Card className="gap-0 border-gray-100 bg-white py-4 shadow-sm">
            <CardContent className="px-5 py-0">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-400">{subtitle}</p>
                    </div>
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
                    >
                        <Icon className={`h-5 w-5 ${text}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
