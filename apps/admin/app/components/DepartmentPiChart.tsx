"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function DepartmentPieChart({ dept }: any) {
  const eligible = Number(dept.eligibleStudents ?? 0);
  const placed = Number(dept.studentsPlaced ?? dept.placements ?? 0);
  const remaining = Math.max(eligible - placed, 0);
  const pct = eligible > 0 ? Math.round((placed / eligible) * 100) : 0;

  const data = [
    { name: "Placed", value: placed },
    { name: "Remaining", value: remaining },
  ];

  const COLORS = ["#818cf8", "#e5e7eb"];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: 20,
        height: 260,
        textAlign: "center",
      }}
    >
      <h4 style={{ fontSize: 14 }}>Placement Rate</h4>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={data} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ fontWeight: 700, fontSize: 18 }}>{pct}%</div>
      <div style={{ fontSize: 12, color: "#64748b" }}>
        {placed}/{eligible} placed
      </div>
    </div>
  );
}
