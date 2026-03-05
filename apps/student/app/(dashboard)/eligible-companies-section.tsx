"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

export type CompanyStatus = "New" | "Closing Soon" | "Applied" | "Inactive";

export type EligibleCompany = {
    id: string;
    name: string;
    role: string;
    salary: string;
    location: string;
    status: CompanyStatus;
};

type EligibleCompaniesSectionProps = {
    companies: EligibleCompany[];
};

const statusConfig = {
    "New": "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    "Closing Soon": "bg-red-50 text-red-600 hover:bg-red-50",
    "Applied": "bg-blue-50 text-blue-600 hover:bg-blue-50",
    "Inactive": "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

export function EligibleCompaniesSection({ companies }: EligibleCompaniesSectionProps) {
    return (
        <Card className="border-gray-100 bg-[#F8FAFC]/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                    Eligible Companies
                </CardTitle>
                <Link
                    href="/jobs"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    View All Jobs
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="flex flex-col sm:flex-row justify-between sm:items-stretch gap-4 rounded-xl border border-gray-100 bg-white p-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/50 shadow-sm">
                                    <Building2 className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div className="space-y-0.5 mt-0.5">
                                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                                    <p className="text-sm text-gray-500">{company.role}</p>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-medium text-gray-900">{company.salary}</p>
                                <p className="text-sm text-gray-500">{company.location}</p>
                            </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 self-stretch">
                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusConfig[company.status]}`}>
                                {company.status}
                            </span>
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 shrink-0 h-9">
                                Apply
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
