// Temporary mock data for integrations
export const getIntegrationsDAO = async () => {
    return [
        {
            id: "google-chat",
            name: "Google Chat",
            description: "Send placement announcements and updates directly to Google Chat groups.",
            category: "Communication",
            lastSync: "5 minutes ago",
            connected: true,
        },
        {
            id: "microsoft-teams",
            name: "Microsoft Teams",
            description: "Send placement drive alerts and interview schedules to Teams channels.",
            category: "Communication",
            connected: false,
        },
    ];
};

export const connectIntegrationDAO = async (provider: string, data: any) => {
    // Mock save connection
    return {
        id: provider,
        name: provider === "google-chat" ? "Google Chat" : "Microsoft Teams",
        description: "Connected successfully",
        category: "Communication",
        connected: true,
        lastSync: "Just now",
        ...data
    };
};

export const disconnectIntegrationDAO = async (provider: string) => {
    return { success: true, message: `Disconnected ${provider}` };
};
