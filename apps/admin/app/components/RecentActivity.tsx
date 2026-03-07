"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { recentActivity as staticRecentActivity, type ActivityItem } from "./data";

export function RecentActivity({ appliedFilters: _appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [open, setOpen] = useState(false);
  const recentActivity = staticRecentActivity;

  return (
    <>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: "14px 18px",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Recent Activity</h3>
          <button
            onClick={() => setOpen(true)}
            style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontWeight: 500 }}
          >
            View All
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "space-between" }}>
          {recentActivity.slice(0, 5).map((item: ActivityItem, idx: number) => (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{item.desc}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.time}</div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 10px",
                  borderRadius: 12,
                  background: item.tag === "job" ? "#ede9fe" : item.tag === "placement" ? "#dcfce7" : item.tag === "recruiter" ? "#fff7ed" : "#fef9c3",
                  color: item.tag === "job" ? "#6366f1" : item.tag === "placement" ? "#22c55e" : item.tag === "recruiter" ? "#f97316" : "#eab308",
                }}
              >
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>All Recent Activities</DialogTitle>
            <DialogDescription>Complete list of latest placement platform activity.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {recentActivity.map((item: ActivityItem, idx: number) => (
              <div
                key={`${item.title}-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                style={{ boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, marginTop: 6, flexShrink: 0 }} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>

                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: item.tag === "job" ? "#ede9fe" : item.tag === "placement" ? "#dcfce7" : item.tag === "recruiter" ? "#fff7ed" : "#fef9c3",
                    color: item.tag === "job" ? "#6366f1" : item.tag === "placement" ? "#22c55e" : item.tag === "recruiter" ? "#f97316" : "#eab308",
                  }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
