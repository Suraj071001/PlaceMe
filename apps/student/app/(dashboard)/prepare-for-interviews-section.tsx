"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { MessageSquare, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";

const prepOptions = [
    {
        title: "Start Mock Interview",
        icon: MessageSquare,
        href: "/mock-interview",
        color: "text-indigo-500",
        bg: "bg-indigo-50",
    },
    {
        title: "Practice MCQ Test",
        icon: HelpCircle,
        href: "/assessment",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
    {
        title: "Previous Questions",
        icon: FileText,
        href: "/questions",
        color: "text-purple-500",
        bg: "bg-purple-50",
    },
];

export function PrepareForInterviewsSection() {
    return (
        <Card className="border-gray-100 bg-[#F8FAFC]/50 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                    Prepare for Interviews
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {prepOptions.map((option) => (
                        <Link
                            key={option.title}
                            href={option.href}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white p-6 text-center transition-colors hover:bg-gray-50 hover:border-gray-200"
                        >
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${option.bg} shadow-sm border border-white`}
                            >
                                <option.icon className={`h-6 w-6 ${option.color}`} />
                            </div>
                            <span className="font-medium text-sm text-gray-900">{option.title}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
