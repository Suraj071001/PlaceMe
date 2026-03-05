"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";

type NotificationPreference = {
    key: string;
    label: string;
    description: string;
    defaultEnabled: boolean;
};

type NotificationPreferencesSectionProps = {
    preferences: NotificationPreference[];
};

export function NotificationPreferencesSection({ preferences }: NotificationPreferencesSectionProps) {
    const [enabled, setEnabled] = useState<Record<string, boolean>>(
        Object.fromEntries(preferences.map((p) => [p.key, p.defaultEnabled]))
    );

    const toggle = (key: string) => {
        setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="divide-y">
                    {preferences.map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={enabled[item.key] ?? false}
                                onChange={() => toggle(item.key)}
                                className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
