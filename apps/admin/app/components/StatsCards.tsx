"use client";

import { stats } from "./data";

export function StatsCards({ appliedFilters: _appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const displayStats = stats;

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
