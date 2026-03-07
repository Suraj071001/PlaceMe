import prisma from "@repo/db";

export const getStudentProfile = async (userId: string) => {
    return await prisma.student.findUnique({
        where: { userId },
        include: {
            user: true,
            branch: true,
            batch: true,
        },
    });
};

export const getStudentNotifications = async (userId: string) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const markStudentNotificationAsRead = async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) return null;
    if (notification.isRead) return notification;

    return prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
};

export const updateStudentProfile = async (
    userId: string,
    studentData: {
        enrollment?: string;
        address?: string;
        skills?: string[];
        branchId?: string;
        batchId?: string;
    },
    userData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }
) => {
    // We use a transaction to ensure both user and student are updated together safely.
    return await prisma.$transaction(async (tx) => {
        // Update the parent User record
        if (Object.keys(userData).length > 0) {
            await tx.user.update({
                where: { id: userId },
                data: userData,
            });
        }

        // Upsert the Student record
        const updatedStudent = await tx.student.upsert({
            where: { userId },
            update: {
                enrollment: studentData.enrollment,
                address: studentData.address,
                skills: studentData.skills,
                branchId: studentData.branchId,
                batchId: studentData.batchId,
            },
            create: {
                userId,
                enrollment: studentData.enrollment || "",
                address: studentData.address || "",
                skills: studentData.skills || [],
                branchId: studentData.branchId || "",
                batchId: studentData.batchId || "",
            },
            include: {
                user: true,
                branch: true,
                batch: true,
            },
        });
        return updatedStudent;
    });
};
