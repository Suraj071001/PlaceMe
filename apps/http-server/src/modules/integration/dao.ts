import prisma from "@repo/db";

export const getIntegrationsDAO = async () => {
    const [googleChatSpaces, activeGoogleChatSpaces] = await Promise.all([
        prisma.googleChatConfig.count(),
        prisma.googleChatConfig.count({ where: { isActive: true } }),
    ]);

    return [
        {
            id: "google-chat",
            name: "Google Chat",
            description: "Send placement announcements and updates directly to Google Chat groups.",
            category: "Communication",
            lastSync: googleChatSpaces > 0 ? "Synced from backend" : undefined,
            connected: googleChatSpaces > 0,
            metadata: {
                totalSpaces: googleChatSpaces,
                activeSpaces: activeGoogleChatSpaces,
            },
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
