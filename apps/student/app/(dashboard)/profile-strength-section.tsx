"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

type ChecklistItem = {
    label: string;
    completed: boolean;
};

type ProfileStrengthSectionProps = {
    percentage: number;
    items: ChecklistItem[];
};

export function ProfileStrengthSection({
    percentage,
    items,
}: ProfileStrengthSectionProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-5 shadow-sm">
            <CardContent className="space-y-4 px-5 py-0">
                <h3 className="text-base font-semibold text-gray-900">
                    Profile Strength
                </h3>

                {/* Progress bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Checklist */}
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-1.5 text-sm"
                        >
                            {item.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                            )}
                            <span
                                className={
                                    item.completed ? "text-gray-700" : "text-amber-600"
                                }
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
