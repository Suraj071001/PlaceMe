"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";

type PersonalInfoData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    enrollment: string;
    address: string;
    branch: string;
    batch: string;
};

type PersonalInfoSectionProps = {
    data: PersonalInfoData;
    onChange?: (key: keyof PersonalInfoData, value: string) => void;
};

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
    const handleChange = (key: keyof PersonalInfoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(key, e.target.value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">First Name</label>
                            <Input value={data.firstName} onChange={handleChange("firstName")} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Last Name</label>
                            <Input value={data.lastName} onChange={handleChange("lastName")} />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Address</label>
                        <Input value={data.address} onChange={handleChange("address")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                            <Input value={data.email} type="email" onChange={handleChange("email")} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
                            <Input value={data.phone} type="tel" onChange={handleChange("phone")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Enrollment Number</label>
                            <Input value={data.enrollment} onChange={handleChange("enrollment")} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Branch</label>
                            <Input value={data.branch} onChange={handleChange("branch")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">Batch</label>
                            <Input value={data.batch} onChange={handleChange("batch")} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
