import {
  getApplicationFormResponseDAO,
  getJobApplicationsByStageDAO,
  updateApplicationStageDAO,
} from "./dao";

export const getJobApplicationsByStageService = async (
  jobId: string,
  filters?: {
    branch?: string;
    batch?: string;
    stage?: string;
    status?: string;
  },
) => {
  return await getJobApplicationsByStageDAO(jobId, filters);
};

export const updateApplicationStageService = async (
  id: string,
  stageId: string,
  status?: string,
) => {
  return await updateApplicationStageDAO(id, stageId, status);
};

export const getApplicationFormResponseService = async (
  applicationId: string,
) => {
  const data = await getApplicationFormResponseDAO(applicationId);
  if (!data) {
    throw new Error("Application not found");
  }
  return data;
};
