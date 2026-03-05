"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

export function ProfilePhotoSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <Button variant="outline" size="sm">
                            Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG or GIF. Max size 2MB
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
