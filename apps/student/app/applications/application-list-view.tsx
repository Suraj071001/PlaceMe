import { Briefcase } from "lucide-react";
import type { Application } from "./application-card";

const statusColors: Record<string, { bg: string; text: string }> = {
    Applied: { bg: "bg-yellow-50", text: "text-yellow-700" },
    "Online Assessment": { bg: "bg-green-50", text: "text-green-700" },
    "Technical Interview": { bg: "bg-blue-50", text: "text-blue-700" },
    "HR Interview": { bg: "bg-purple-50", text: "text-purple-700" },
    Selected: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Rejected: { bg: "bg-red-50", text: "text-red-700" },
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

type ApplicationListViewProps = {
    applications: Application[];
};

export function ApplicationListView({ applications }: ApplicationListViewProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Tier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Package
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Applied Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                            Interview Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => {
                        const status = statusColors[app.status] ?? statusColors["Applied"]!;
                        const tier = tierColors[app.tier] ?? tierColors["Tier 1"]!;
                        const type = typeColors[app.type] ?? typeColors["Full-time"]!;

                        return (
                            <tr
                                key={app.id}
                                className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
                                            <Briefcase className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {app.company}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{app.role}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${type.bg} ${type.text}`}
                                    >
                                        {app.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tier.bg} ${tier.text}`}
                                    >
                                        {app.tier}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-700">
                                    ₹{app.package} LPA
                                </td>
                                <td className="px-4 py-3 text-gray-600">{app.location}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.bg} ${status.text}`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{app.appliedDate}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {app.interviewDate ?? "–"}
                                </td>
                            </tr>
                        );
                    })}
                    {applications.length === 0 && (
                        <tr>
                            <td colSpan={9} className="py-12 text-center text-muted-foreground">
                                No applications found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
