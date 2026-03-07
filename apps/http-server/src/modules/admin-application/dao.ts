import db from "@repo/db";

export const getJobApplicationsByStageDAO = async (
  jobId: string,
  filters?: {
    branch?: string;
    batch?: string;
    stage?: string;
    status?: string;
  },
) => {
  // Fetch applications for a specific job, including student details and current stage/status
  const where: any = { jobId, deletedAt: null };
  if (filters?.branch) {
    where.student = { ...where.student, branch: { name: filters.branch } };
  }
  if (filters?.batch) {
    where.student = { ...where.student, batch: { name: filters.batch } };
  }
  if (filters?.stage) {
    where.stage = { name: filters.stage };
  }
  if (filters?.status) {
    where.status = filters.status;
  }
  return await db.application.findMany({
    where,
    include: {
      job: {
        include: {
          company: { select: { name: true } },
          department: { select: { name: true } },
        },
      },
      student: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          branch: { select: { name: true } },
          batch: { select: { name: true } },
        },
      },
      stage: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateApplicationStageDAO = async (
  id: string,
  stageId: string,
  status?: any,
) => {
  const dataToUpdate: any = { stageId };
  if (status) {
    dataToUpdate.status = status;
  }

  return await db.application.update({
    where: { id },
    data: dataToUpdate,
    include: {
      job: {
        include: {
          company: { select: { name: true } },
          department: { select: { name: true } },
        },
      },
      student: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          branch: { select: { name: true } },
          batch: { select: { name: true } },
        },
      },
      stage: true,
    },
  });
};

export const getApplicationFormResponseDAO = async (applicationId: string) => {
  return db.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          company: { select: { name: true } },
          applicationForms: {
            include: {
              sections: {
                orderBy: { order: "asc" },
                include: {
                  questions: {
                    orderBy: { order: "asc" },
                    include: { options: true },
                  },
                },
              },
            },
          },
        },
      },
      student: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          branch: { select: { name: true } },
          batch: { select: { name: true } },
        },
      },
      formResponse: {
        include: {
          answers: true,
        },
      },
    },
  });
};
