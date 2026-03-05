"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

export function ChangePasswordSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Current Password</label>
                        <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">New Password</label>
                        <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
                        <Input type="password" placeholder="Re-enter new password" />
                    </div>
                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Update Password
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
