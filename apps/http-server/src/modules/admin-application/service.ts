import { getJobApplicationsByStageDAO, updateApplicationStageDAO } from "./dao";

export const getJobApplicationsByStageService = async (jobId: string) => {
    return await getJobApplicationsByStageDAO(jobId);
};

export const updateApplicationStageService = async (id: string, stageId: string, status?: string) => {
    return await updateApplicationStageDAO(id, stageId, status);
};
