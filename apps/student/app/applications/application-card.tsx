import { Card, CardContent } from "@repo/ui/components/card";
import { Briefcase, Calendar, Clock } from "lucide-react";

export type Application = {
    id: string;
    company: string;
    role: string;
    appliedDate: string;
    interviewDate?: string;
    status: string;
};

type ApplicationCardProps = {
    application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-3 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="px-4 py-0">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                        <Briefcase className="h-4 w-4" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="truncate text-sm font-semibold text-gray-900">
                            {application.company}
                        </h4>
                        <p className="truncate text-xs text-gray-500">
                            {application.role}
                        </p>

                        {/* Dates */}
                        <div className="space-y-0.5 pt-0.5">
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
