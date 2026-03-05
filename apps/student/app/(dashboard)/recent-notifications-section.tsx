"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

type Notification = {
    message: string;
    time: string;
    color: "blue" | "green";
};

type RecentNotificationsSectionProps = {
    notifications: Notification[];
};

const dotColor: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
};

export function RecentNotificationsSection({
    notifications,
}: RecentNotificationsSectionProps) {
    return (
        <Card className="gap-0 border-gray-100 bg-white py-5 shadow-sm">
            <CardContent className="space-y-4 px-5 py-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Recent Notifications
                    </h3>
                    <Button variant="outline" size="sm" className="text-xs">
                        View All
                    </Button>
                </div>

                {/* Notification list */}
                <div className="space-y-3">
                    {notifications.map((n, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3"
                        >
                            <div
                                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[n.color] ?? dotColor["blue"]}`}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-700">{n.message}</p>
                                <p className="text-xs text-gray-400">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
