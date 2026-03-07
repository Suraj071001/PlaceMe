"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle2, Target, Building2, DollarSign } from "lucide-react";

export function StatsCards({ appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [displayStats, setDisplayStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/analytics/stats");
        const json = await res.json();
        if (json.success && json.data) {
          const apiStats = [
            { title: "Eligible Students", value: json.data.eligibleStudents.toLocaleString(), icon: Users, iconBg: "#EEF2FF", iconColor: "#6366F1" },
            { title: "Students Placed", value: json.data.studentsPlaced.toLocaleString(), icon: CheckCircle2, iconBg: "#ECFDF5", iconColor: "#10B981" },
            { title: "Placement Rate", value: json.data.placementRate, icon: Target, iconBg: "#F3E8FF", iconColor: "#A855F7" },
            { title: "Companies Visited", value: json.data.companiesVisited.toLocaleString(), icon: Building2, iconBg: "#FEF3C7", iconColor: "#F59E0B" },
            { title: "Average Package", value: json.data.averagePackage, icon: DollarSign, iconBg: "#DCFCE7", iconColor: "#16A34A" },
          ];
          setDisplayStats(apiStats);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [appliedFilters]);

  if (loading) {
    return <div className="h-24 w-full animate-pulse bg-slate-100 rounded-xl mb-6 flex items-center justify-center text-sm text-slate-400">Loading Stats...</div>;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
      {displayStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            {/* Icon Container */}
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: stat.iconBg }}>
              <Icon size={18} color={stat.iconColor} />
            </div>

            {/* Title */}
            <div className="mb-1 text-[13px] text-slate-500">{stat.title}</div>

            {/* Value */}
            <div className="text-xl font-semibold text-slate-900 sm:text-[22px]">{stat.value}</div>

            {/* Change */}
            <div className="mt-1 text-xs text-green-500">{(stat as any).change}</div>
          </div>
        );
      })}
    </div>
  );
}
