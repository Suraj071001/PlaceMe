"use client";

import { useState } from "react";
import { Briefcase, CheckCircle2, Calendar, Bell, Mail } from "lucide-react";
import { Card } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { SettingsDialog } from "./settings-dialog";

type NotificationType = "job" | "application" | "interview" | "reminder" | "profile";

interface NotificationItem {
    id: number;
    type: NotificationType;
    title: string;
    desc: string;
    time: string;
    unread: boolean;
}

const initialNotifications: NotificationItem[] = [
    {
        id: 1,
        type: "job",
        title: "New job posted",
        desc: "Google has posted a new position: Software Engineer",
        time: "2 hours ago",
        unread: true
    },
    {
        id: 2,
        type: "application",
        title: "Application shortlisted",
        desc: "Your application for Microsoft - Product Manager has been shortlisted",
        time: "5 hours ago",
        unread: true
    },
    {
        id: 3,
        type: "interview",
        title: "Interview scheduled",
        desc: "Interview scheduled for Amazon on March 12, 2026 at 10:00 AM",
        time: "1 day ago",
        unread: false
    },
    {
        id: 4,
        type: "reminder",
        title: "Application deadline approaching",
        desc: "Apply for Netflix - Backend Engineer before March 25, 2026",
        time: "1 day ago",
        unread: false
    },
    {
        id: 5,
        type: "profile",
        title: "Profile update reminder",
        desc: "Update your resume and skills to improve profile strength",
        time: "2 days ago",
        unread: false
    },
];

const getIconForType = (type: NotificationType) => {
    switch (type) {
        case "job":
            return <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5" /></div>;
        case "application":
            return <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>;
        case "interview":
            return <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0"><Calendar className="w-5 h-5" /></div>;
        case "reminder":
            return <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><Bell className="w-5 h-5" /></div>;
        case "profile":
            return <div className="w-10 h-10 bg-fuchsia-50 text-fuchsia-500 rounded-lg flex items-center justify-center shrink-0"><Mail className="w-5 h-5" /></div>;
    }
};

export default function NotificationsPage() {
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => n.unread).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return n.unread;
        return true;
    });

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Stay updated on your placement activities</p>
                </div>
                <SettingsDialog />
            </div>

            <Card className="p-2 flex flex-row items-center gap-2 w-fit bg-gray-50/50">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            ${filter === "all" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}
          `}
                >
                    All
                    <span className={`px-2 py-0.5 rounded-full text-xs ${filter === "all" ? "bg-gray-100" : "bg-gray-200"}`}>
                        {notifications.length}
                    </span>
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
            ${filter === "unread" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}
          `}
                >
                    Unread
                    <span className={`px-2 py-0.5 rounded-full text-xs ${filter === "unread" ? "bg-gray-100" : "bg-gray-200"}`}>
                        {unreadCount}
                    </span>
                </button>
            </Card>

            <Card className="overflow-hidden border-gray-200">
                <div className="flex flex-col">
                    {filteredNotifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className={`
                flex items-start gap-4 p-5 transition-colors
                ${index !== filteredNotifications.length - 1 ? 'border-b border-gray-100' : ''}
                ${notification.unread ? 'bg-indigo-50/30' : 'bg-white hover:bg-gray-50/50'}
              `}
                        >
                            {getIconForType(notification.type)}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {notification.desc}
                                </p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    {notification.time}
                                </p>
                            </div>
                            {notification.unread && (
                                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                            )}
                        </div>
                    ))}
                    {filteredNotifications.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No notifications found.
                        </div>
                    )}
                </div>
            </Card>

            {unreadCount > 0 && (
                <div className="flex justify-center mt-2">
                    <Button variant="outline" onClick={markAllAsRead} className="bg-white">
                        Mark All as Read
                    </Button>
                </div>
            )}
        </div>
    );
}
