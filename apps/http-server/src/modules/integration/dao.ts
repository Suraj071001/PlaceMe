import prisma from "@repo/db";

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

export const getGoogleChatSpacesDAO = async () => {
    const configs = await prisma.googleChatConfig.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            batch: {
                include: {
                    branch: {
                        include: {
                            department: true,
                        },
                    },
                },
            },
        },
    });

    return configs.map((config) => {
        const batchName = config.batch?.name ?? "Unknown Batch";
        const branchName = config.batch?.branch?.name ?? "Unknown Branch";
        const departmentName = config.batch?.branch?.department?.name ?? "Unknown Department";

        return {
            id: config.batchId,
            name: `${departmentName} • ${branchName} • ${batchName}`,
            active: config.isActive,
            createdAt: config.createdAt,
        };
    });
};
