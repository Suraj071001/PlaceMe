"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";

type ActivityItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  tag: string;
  color: string;
};

type AuditLogItem = {
  id: string;
  action: string;
  companyId: string;
  time: string;
  meta?: unknown;
};

const API_BASE_CANDIDATES = ["http://localhost:5501/api/v1", "/api/v1"];

async function fetchFromApi(path: string, token: string | null) {
  let lastError: unknown;
  for (const base of API_BASE_CANDIDATES) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        lastError = new Error(`${res.status} ${res.statusText}`);
        continue;
      }
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("Failed to fetch");
}

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
};

export function RecentActivity({ appliedFilters: _appliedFilters }: { appliedFilters?: Record<string, string[]> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"activity" | "audit">("activity");
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [allActivity, setAllActivity] = useState<ActivityItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const loadRecentActivity = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const json = await fetchFromApi("/analytics/recent-activity", token);
      setRecentActivity((json?.data ?? []) as ActivityItem[]);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch recent activity");
    }
  };

  const loadModalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const [activityRes, auditRes] = await Promise.all([
        fetchFromApi("/analytics/activity?limit=100", token),
        fetchFromApi("/analytics/audit-logs?limit=100", token),
      ]);
      setAllActivity((activityRes?.data ?? []) as ActivityItem[]);
      setAuditLogs((auditRes?.data ?? []) as AuditLogItem[]);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch activity/audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActivity();
  }, []);

  useEffect(() => {
    if (open) {
      loadModalData();
    }
  }, [open]);

  const cardItems = useMemo(() => recentActivity.slice(0, 5), [recentActivity]);

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
          {cardItems.map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{item.desc}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{formatTime(item.time)}</div>
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
          {cardItems.length === 0 ? <div style={{ fontSize: 12, color: "#64748b" }}>No activity found.</div> : null}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Activity & Audit Log</DialogTitle>
            <DialogDescription>Live backend data for recent activity and audit history.</DialogDescription>
          </DialogHeader>

          <div className="mb-2 flex items-center gap-2">
            <Button variant={tab === "activity" ? "default" : "outline"} onClick={() => setTab("activity")}>
              Activity
            </Button>
            <Button variant={tab === "audit" ? "default" : "outline"} onClick={() => setTab("audit")}>
              Audit Log
            </Button>
          </div>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {loading ? <div className="text-sm text-slate-500">Loading...</div> : null}
            {!loading && error ? <div className="text-sm text-red-600">{error}</div> : null}

            {!loading && !error && tab === "activity"
              ? allActivity.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                    style={{ boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, marginTop: 6, flexShrink: 0 }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatTime(item.time)}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{item.tag}</span>
                  </div>
                ))
              : null}

            {!loading && !error && tab === "audit"
              ? auditLogs.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3" style={{ boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                    <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                    <p className="text-xs text-slate-500">Company: {item.companyId}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatTime(item.time)}</p>
                    {item.meta ? (
                      <pre className="mt-2 overflow-x-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-600">{JSON.stringify(item.meta, null, 2)}</pre>
                    ) : null}
                  </div>
                ))
              : null}

            {!loading && !error && tab === "activity" && allActivity.length === 0 ? <div className="text-sm text-slate-500">No activity records found.</div> : null}
            {!loading && !error && tab === "audit" && auditLogs.length === 0 ? <div className="text-sm text-slate-500">No audit logs found.</div> : null}
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
