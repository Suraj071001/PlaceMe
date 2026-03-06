"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Settings } from "lucide-react";

function Switch({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}

export function SettingsDialog() {
    const [open, setOpen] = useState(false);

    const [settings, setSettings] = useState({
        email: true,
        push: true,
        jobPostings: true,
        applicationUpdates: true,
        interviewSchedules: true,
        deadlineReminders: true,
        frequency: "Instant",
        quietHours: false,
        soundEnabled: true,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700">
                    <Settings className="w-4 h-4" />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b shrink-0">
                    <DialogTitle className="text-xl font-semibold text-gray-900">Notification Settings</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Configure how and when you receive notifications about placements and internships.</p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Delivery Methods */}
                    <section>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Methods</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Receive notifications via email</p>
                                </div>
                                <Switch checked={settings.email} onChange={() => toggle("email")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Receive browser push notifications</p>
                                </div>
                                <Switch checked={settings.push} onChange={() => toggle("push")} />
                            </div>
                        </div>
                    </section>

                    {/* Notification Types */}
                    <section>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Types</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Job Postings</p>
                                <Switch checked={settings.jobPostings} onChange={() => toggle("jobPostings")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Application Updates</p>
                                <Switch checked={settings.applicationUpdates} onChange={() => toggle("applicationUpdates")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Interview Schedules</p>
                                <Switch checked={settings.interviewSchedules} onChange={() => toggle("interviewSchedules")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Deadline Reminders</p>
                                <Switch checked={settings.deadlineReminders} onChange={() => toggle("deadlineReminders")} />
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Preferences</h4>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 block">Notification Frequency</label>
                                <select
                                    value={settings.frequency}
                                    onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    <option>Instant</option>
                                    <option>Daily Digest</option>
                                    <option>Weekly Digest</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Quiet Hours (10 PM - 8 AM)</p>
                                    <p className="text-xs text-gray-500 mt-0.5">No notifications during quiet hours</p>
                                </div>
                                <Switch checked={settings.quietHours} onChange={() => toggle("quietHours")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Sound Enabled</p>
                                <Switch checked={settings.soundEnabled} onChange={() => toggle("soundEnabled")} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-4 border-t shrink-0 flex items-center justify-end gap-3 bg-gray-50/50">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setOpen(false)}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
