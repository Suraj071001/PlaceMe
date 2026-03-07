import { createApplication, getApplicationById, getJobWithApplicationForm, getStudentApplications, linkApplicationToPipeline } from "./dao";
import type { ApplyJobPayload, StudentApplicationQuery } from "@repo/zod";
import logger from "../../utils/logger";
import client from "@repo/db/index";

export const applyJobService = async (studentId: string, payload: ApplyJobPayload) => {
  logger.info("Apply to job started for student", { studentId, jobId: payload.jobId });

  // Check if job exists and has a form
  const job = await client.job.findUnique({
    where: { id: payload.jobId },
    include: { applicationForms: true },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Check if student applied already
  const existing = await client.application.findUnique({
    where: {
      studentId_jobId: {
        studentId,
        jobId: payload.jobId,
      },
    },
  });

  if (existing) {
    throw new Error("You have already applied to this job");
  }

  const requiresForm = job.applicationForms && job.applicationForms.length > 0;

  const application = await createApplication(studentId, payload.jobId, requiresForm);

  if (!requiresForm) {
    // Automatically enter pipeline
    await linkApplicationToPipeline(application.id, payload.jobId);
  }

  logger.info("Application created successfully", { applicationId: application.id });
  return application;
};

export const getApplicationByIdService = async (id: string, studentId: string) => {
  const application = await getApplicationById(id);
  if (!application) throw new Error("Application not found");
  if (application.studentId !== studentId) {
    throw new Error("Unauthorized access to this application");
  }
  return application;
};

const normalizeTrackingStatus = (status?: string, stageName?: string | null) => {
  if (stageName && stageName.trim()) return stageName.trim();

  switch (status) {
    case "DRAFT":
    case "APPLIED":
      return "Applied";
    case "SCREENING":
    case "PHONE_SCREEN":
      return "Online Assessment";
    case "INTERVIEW":
      return "Technical Interview";
    case "OFFER":
      return "HR Interview";
    case "HIRED":
      return "Selected";
    case "REJECTED":
    case "ARCHIVED":
      return "Rejected";
    default:
      return "Applied";
  }
};

const parseCtcLpa = (ctc?: string | null) => {
  if (!ctc) return 0;
  const match = ctc.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

export const getMyApplicationsService = async (studentId: string, filters: StudentApplicationQuery) => {
  const applications = await getStudentApplications(studentId, filters);

  return applications.filter((application) => {
    const trackingStatus = normalizeTrackingStatus(application.status, application.stage?.name);
    const ctcLpa = parseCtcLpa(application.job?.ctc ?? null);

    if (filters.status && trackingStatus.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }

    if (filters.minPackage !== undefined && ctcLpa < filters.minPackage) {
      return false;
    }

    if (filters.maxPackage !== undefined && ctcLpa > filters.maxPackage) {
      return false;
    }

    if (filters.appliedFrom && application.createdAt < filters.appliedFrom) {
      return false;
    }

    if (filters.appliedTo && application.createdAt > filters.appliedTo) {
      return false;
    }

    return true;
  });
};

export const getJobApplicationFormService = async (jobId: string) => {
  const job = await getJobWithApplicationForm(jobId);
  if (!job) throw new Error("Job not found");

  const form = job.applicationForms?.[0] ?? null;

  return {
    job: {
      id: job.id,
      title: job.title,
      role: job.role,
      company: job.company?.name ?? null,
      description: job.description ?? null,
      closeAt: job.closeAt,
    },
    form,
  };
};
