"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";

type PersonalInfoData = {
    fullName: string;
    email: string;
    phone: string;
    rollNumber: string;
    branch: string;
    year: string;
    cgpa: string;
};

type PersonalInfoSectionProps = {
    data: PersonalInfoData;
};

export function PersonalInfoSection({ data }: PersonalInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                        <Input defaultValue={data.fullName} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                            <Input defaultValue={data.email} type="email" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
                            <Input defaultValue={data.phone} type="tel" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Roll Number</label>
                            <Input defaultValue={data.rollNumber} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Branch</label>
                            <Input defaultValue={data.branch} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Year</label>
                            <Input defaultValue={data.year} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">CGPA</label>
                            <Input defaultValue={data.cgpa} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
