"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { ProfilePhotoSection } from "./profile-photo-section";
import { PersonalInfoSection } from "./personal-info-section";
import { SkillsSection } from "./skills-section";
import { ChangePasswordSection } from "./change-password-section";
import { NotificationPreferencesSection } from "./notification-preferences-section";

const initialSkills = ["React", "Node.js", "Python", "Java"];

const notificationPreferences = [
    { key: "email", label: "Email Notifications", description: "Receive updates via email", defaultEnabled: true },
    { key: "jobAlerts", label: "Job Alerts", description: "Get notified about new job postings", defaultEnabled: true },
    { key: "applicationUpdates", label: "Application Updates", description: "Updates on your application status", defaultEnabled: true },
    { key: "interviewReminders", label: "Interview Reminders", description: "Reminders for upcoming interviews", defaultEnabled: true },
];

export default function ProfilePage() {
    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        enrollment: "",
        address: "",
        branch: "",
        batch: "",
        skills: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("http://localhost:5501/api/v1/student/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const result = await res.json();
                    const data = result.data || {};
                    setPersonalInfo({
                        firstName: data.user?.firstName || "",
                        lastName: data.user?.lastName || "",
                        email: data.user?.email || "",
                        phone: data.user?.phone || "",
                        enrollment: data.enrollment || "",
                        address: data.address || "",
                        branch: data.branch?.name || data.branchId || "",
                        batch: data.batch?.name || data.batchId || "",
                        skills: data.skills || [],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:5501/api/v1/student/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(personalInfo)
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || "Failed to save profile"}`);
            } else {
                alert("Profile saved successfully!");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Save error", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="mx-auto max-w-6xl p-10 text-center">Loading profile...</div>;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account information and preferences</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Edit Profile
                    </Button>
                )}
            </div>

            <ProfilePhotoSection />
            <PersonalInfoSection
                data={personalInfo}
                isEditing={isEditing}
                onChange={(key, value) => setPersonalInfo(prev => ({ ...prev, [key]: value }))}
            />
            <SkillsSection
                skills={personalInfo.skills}
                isEditing={isEditing}
                onChange={(skills) => setPersonalInfo(prev => ({ ...prev, skills }))}
            />
            <ChangePasswordSection />
            <NotificationPreferencesSection preferences={notificationPreferences} />

            {isEditing && (
                <div className="flex justify-end gap-4">
                    <Button variant="outline" className="min-w-[140px]" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="min-w-[140px] bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            )}
        </div>
    );
}
