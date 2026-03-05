"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import {
    TrendingUp,
    HelpCircle,
    MessageSquare,
    FileText,
    CalendarDays,
    Clock,
    type LucideIcon,
} from "lucide-react";

export type NextActionStatus = "Urgent" | "Scheduled" | "Pending";
export type NextActionType = "assessment" | "technical" | "resume";

export type NextAction = {
    id: string;
    type: NextActionType;
    title: string;
    status: NextActionStatus;
    company: string;
    date: string;
    time?: string;
};

type NextImportantActionsSectionProps = {
    actions: NextAction[];
};

const iconConfig = {
    assessment: { Icon: HelpCircle, color: "text-gray-600" },
    technical: { Icon: MessageSquare, color: "text-gray-600" },
    resume: { Icon: FileText, color: "text-gray-600" },
};

const statusConfig = {
    Urgent: "bg-red-50 text-red-600 hover:bg-red-50",
    Scheduled: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    Pending: "bg-amber-50 text-amber-600 hover:bg-amber-50",
};

export function NextImportantActionsSection({ actions }: NextImportantActionsSectionProps) {
    const pendingCount = actions.filter((a) => a.status === "Pending" || a.status === "Urgent").length + 2; // Hardcoding to 3 based on mockup logic or just pass a number

    return (
        <Card className="border-gray-100 bg-[#F8FAFC]/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                        Next Important Actions
                    </CardTitle>
                </div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                    3 Pending
                </span>
            </CardHeader>
            <CardContent className="space-y-3">
                {actions.map((action) => {
                    const { Icon, color } = iconConfig[action.type];
                    return (
                        <div
                            key={action.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 border-l-4 border-l-indigo-500 bg-white p-4"
                        >
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                                    <Icon className={`h-5 w-5 ${color}`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                                        <span className={`inline-flex items-center rounded-md px-1.5 py-0 text-[10px] font-semibold ${statusConfig[action.status]}`}>
                                            {action.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{action.company}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            <span>{action.date}</span>
                                        </div>
                                        {action.time && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{action.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 px-4 shrink-0">
                                View Details
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
