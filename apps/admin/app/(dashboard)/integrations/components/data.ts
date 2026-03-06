export type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  lastSync?: string;
};

export const integrations: Integration[] = [
  {
    id: "google-chat",
    name: "Google Chat",
    description: "Send automated placement notifications to Google Chat spaces for departments and batches.",
    category: "Communication",
    connected: false,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Notify students and faculty about placement drives and internship updates directly in Teams channels.",
    category: "Communication",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post internship alerts, job postings, and placement announcements to Slack workspaces.",
    category: "Communication",
    connected: false,
  },
  {
    id: "email",
    name: "Email Notifications",
    description: "Send automated placement notifications and reminders directly to student email addresses.",
    category: "Notifications",
    connected: true,
    lastSync: "2 hours ago",
  },
];
