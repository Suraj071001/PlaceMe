"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Check, CheckCircle2, Calendar, Bell, Mail, Sparkles } from "lucide-react";
import { Card } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { SettingsDialog } from "./settings-dialog";

type NotificationType = "job" | "application" | "interview" | "reminder" | "profile";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

type ApiNotification = {
  id: string;
  type: string;
  payload: unknown;
  isRead: boolean;
  createdAt: string;
};

const API_BASE = typeof window !== "undefined" ? "http://localhost:5501/api/v1" : "";

const toNotificationType = (type: string): NotificationType => {
  if (type === "job" || type === "application" || type === "interview" || type === "reminder" || type === "profile") {
    return type;
  }
  return "reminder";
};

const formatRelativeTime = (createdAt: string): string => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - created);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const toPayloadObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
  return payload as Record<string, unknown>;
};

const toNotificationItem = (notification: ApiNotification): NotificationItem => {
  const payload = toPayloadObject(notification.payload);
  const title = typeof payload.title === "string" && payload.title.trim() ? payload.title : "Notification";
  const desc =
    typeof payload.desc === "string" && payload.desc.trim()
      ? payload.desc
      : typeof payload.message === "string" && payload.message.trim()
        ? payload.message
        : "You have a new update.";

  return {
    id: notification.id,
    type: toNotificationType(notification.type),
    title,
    desc,
    time: formatRelativeTime(notification.createdAt),
    unread: !notification.isRead,
  };
};

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case "job":
      return (
        <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
      );
    case "application":
      return (
        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    case "interview":
      return (
        <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
      );
    case "reminder":
      return (
        <div className="w-11 h-11 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
      );
    case "profile":
      return (
        <div className="w-11 h-11 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5" />
        </div>
      );
  }
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = getToken();
        if (!token) {
          setNotifications([]);
          setError("Please login to view notifications.");
          return;
        }

        const res = await fetch(`${API_BASE}/student/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setNotifications([]);
          setError("Unable to load notifications.");
          return;
        }

        const body = await res.json();
        const list = Array.isArray(body?.data) ? (body.data as ApiNotification[]) : [];
        setNotifications(list.map(toNotificationItem));
        setError(null);
      } catch {
        setNotifications([]);
        setError("Something went wrong while loading notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.unread;
    return true;
  });

  const markNotificationAsRead = async (notificationId: string) => {
    const token = getToken();
    if (!token) return;

    setBusyIds((prev) => [...prev, notificationId]);
    try {
      const res = await fetch(`${API_BASE}/student/notifications/${notificationId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        return;
      }

      setNotifications((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, unread: false } : item)),
      );
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => n.unread).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setIsMarkingAll(true);
    try {
      await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated on your placement activities</p>
        </div>
        <SettingsDialog />
      </div>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white p-6">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-cyan-300/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Inbox Status</p>
            <div className="mt-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <p className="text-2xl font-semibold">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p>
            </div>
          </div>
          <Button
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || isMarkingAll}
            className="bg-white text-slate-900 hover:bg-slate-100"
          >
            {isMarkingAll ? "Updating..." : "Mark all as read"}
          </Button>
        </div>
      </Card>

      <Card className="p-2 flex flex-row items-center gap-2 w-fit bg-gray-50/70 border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "all" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All
          <span className={`px-2 py-0.5 rounded-full text-xs ${filter === "all" ? "bg-gray-100" : "bg-gray-200"}`}>
            {notifications.length}
          </span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "unread" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread
          <span className={`px-2 py-0.5 rounded-full text-xs ${filter === "unread" ? "bg-gray-100" : "bg-gray-200"}`}>
            {unreadCount}
          </span>
        </button>
      </Card>

      <Card className="overflow-hidden border-gray-200 bg-white/90 shadow-sm">
        <div className="flex flex-col">
          {isLoading && <div className="p-8 text-center text-gray-500">Loading notifications...</div>}
          {!isLoading && error && <div className="p-8 text-center text-red-500">{error}</div>}

          {!isLoading && !error &&
            filteredNotifications.map((notification, index) => {
              const isBusy = busyIds.includes(notification.id);
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-5 transition-colors ${
                    index !== filteredNotifications.length - 1 ? "border-b border-gray-100" : ""
                  } ${notification.unread ? "bg-cyan-50/50" : "bg-white hover:bg-gray-50/60"}`}
                >
                  {getIconForType(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${notification.unread ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </p>
                      {notification.unread && <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notification.desc}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                      <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {notification.type}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {notification.unread ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markNotificationAsRead(notification.id)}
                        disabled={isBusy}
                        className="bg-white"
                      >
                        {isBusy ? "Saving..." : "Mark as read"}
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Read
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && !error && filteredNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">No notifications found.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
