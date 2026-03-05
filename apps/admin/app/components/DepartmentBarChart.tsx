"use client";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DepartmentBarChart({ dept }: any) {
  const parseLpa = (value: unknown) => {
    if (typeof value !== "string") return 0;
    const n = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const data = [
    {
      name: dept.name,
      placements: dept.placements,
      internships: dept.internships,
      offers: Number(dept.offers ?? 0),
      avgLpa: parseLpa(dept.avgPackage),
      highestLpa: parseLpa(dept.highestPackage),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: 20,
        height: 260,
      }}
    >
      <h4 style={{ fontSize: 14, marginBottom: 10 }}>Placements, Internships, Offers & Package</h4>

      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis yAxisId="count" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="lpa" orientation="right" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: any, name: any) => {
              if (name === "avgLpa") return [`${value} LPA`, "Avg Package"];
              if (name === "highestLpa") return [`${value} LPA`, "Highest Package"];
              if (name === "offers") return [value, "Offers"];
              if (name === "placements") return [value, "Placements"];
              if (name === "internships") return [value, "Internships"];
              return [value, name];
            }}
          />

          <Bar yAxisId="count" dataKey="placements" fill="#818cf8" radius={[6, 6, 0, 0]} />

          <Bar yAxisId="count" dataKey="internships" fill="#86efac" radius={[6, 6, 0, 0]} />

          <Bar yAxisId="count" dataKey="offers" fill="#fb923c" radius={[6, 6, 0, 0]} />

          <Line yAxisId="lpa" type="monotone" dataKey="avgLpa" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line yAxisId="lpa" type="monotone" dataKey="highestLpa" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
