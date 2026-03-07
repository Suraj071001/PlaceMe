import { getStudentProfile, updateStudentProfile } from "./dao";
import type { UpdateStudentProfilePayload } from "@repo/zod";
import { ERROR, LOG } from "../../constants";
import logger from "../../utils/logger";

import prisma from "@repo/db";

export const getStudentProfileService = async (userId: string) => {
    logger.info(LOG.STUDENT_FETCH_START, { userId });
    const profile = await getStudentProfile(userId);
    if (!profile) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");
        return {
            user,
            enrollment: "",
            address: "",
            branch: null,
            batch: null,
            skills: []
        };
    }
    return profile;
};

export const updateStudentProfileService = async (
    userId: string,
    payload: UpdateStudentProfilePayload
) => {
    logger.info(LOG.STUDENT_UPDATE_START, { userId });

    const { firstName, lastName, phone, branch, batch, ...studentData } = payload as any;
    const userData = { firstName, lastName, phone };

    let branchId;
    if (branch) {
        let b = await prisma.branch.findFirst({ where: { name: branch } });
        if (!b) {
            const dep = await prisma.department.findFirst();
            if (dep) {
                b = await prisma.branch.create({ data: { name: branch, departmentId: dep.id } });
            }
        }
        if (b) branchId = b.id;
    } else {
        let b = await prisma.branch.findFirst();
        if (b) branchId = b.id;
    }

    let batchId;
    if (batch && branchId) {
        let b = await prisma.batch.findFirst({ where: { name: batch, branchId } });
        if (!b) {
            b = await prisma.batch.create({ data: { name: batch, branchId } });
        }
        if (b) batchId = b.id;
    } else {
        let b = await prisma.batch.findFirst();
        if (b) batchId = b.id;
    }

    if (!branchId || !batchId) {
        throw new Error("Cannot resolve branch or batch to map to your profile.");
    }

    const updatedProfile = await updateStudentProfile(userId, { ...studentData, branchId, batchId }, userData);
    if (!updatedProfile) {
        logger.warn(LOG.STUDENT_UPDATE_FAILED, { userId });
        throw new Error("Failed to update student profile");
    }

    logger.info(LOG.STUDENT_UPDATE_SUCCESS, { userId });
    return updatedProfile;
};
