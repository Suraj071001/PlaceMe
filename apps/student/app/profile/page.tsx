import { Button } from "@repo/ui/components/button";
import { ProfilePhotoSection } from "./profile-photo-section";
import { PersonalInfoSection } from "./personal-info-section";
import { SkillsSection } from "./skills-section";
import { ChangePasswordSection } from "./change-password-section";
import { NotificationPreferencesSection } from "./notification-preferences-section";

const personalInfo = {
    fullName: "John Doe",
    email: "john.doe@college.edu",
    phone: "+91 98765 43210",
    rollNumber: "2024001",
    branch: "CSE",
    year: "3rd Year",
    cgpa: "8.5",
};

const initialSkills = ["React", "Node.js", "Python", "Java"];

const notificationPreferences = [
    { key: "email", label: "Email Notifications", description: "Receive updates via email", defaultEnabled: true },
    { key: "jobAlerts", label: "Job Alerts", description: "Get notified about new job postings", defaultEnabled: true },
    { key: "applicationUpdates", label: "Application Updates", description: "Updates on your application status", defaultEnabled: true },
    { key: "interviewReminders", label: "Interview Reminders", description: "Reminders for upcoming interviews", defaultEnabled: true },
];

export default function ProfilePage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <ProfilePhotoSection />
            <PersonalInfoSection data={personalInfo} />
            <SkillsSection initialSkills={initialSkills} />
            <ChangePasswordSection />
            <NotificationPreferencesSection preferences={notificationPreferences} />

            <div className="flex justify-end gap-4">
                <Button variant="outline" className="min-w-[140px]">
                    Cancel
                </Button>
                <Button className="min-w-[140px] bg-indigo-600 text-white hover:bg-indigo-700">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
