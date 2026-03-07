import client from "@repo/db";

export async function getStudentByUserId(userId: string) {
  return client.student.findFirst({
    where: { userId },
    include: {
      user: true,
      branch: true,
      batch: true,
    },
  });
}

async function resolveDefaultAcademicContext(tx: any): Promise<{ branchId: string; batchId: string }> {
  const existingBatch = await tx.batch.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, branchId: true },
  });
  if (existingBatch) {
    return { branchId: existingBatch.branchId, batchId: existingBatch.id };
  }

  let branch = await tx.branch.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!branch) {
    let department = await tx.department.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!department) {
      department = await tx.department.create({
        data: { name: "General" },
        select: { id: true },
      });
    }

    branch = await tx.branch.create({
      data: {
        name: "General",
        departmentId: department.id,
      },
      select: { id: true },
    });
  }

  const batch = await tx.batch.create({
    data: {
      name: "General",
      branchId: branch.id,
    },
    select: { id: true, branchId: true },
  });

  return { branchId: batch.branchId, batchId: batch.id };
}

export async function getOrCreateStudentByUserId(userId: string) {
  const existing = await getStudentByUserId(userId);
  if (existing) return existing;

  return client.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return null;

    const academic = await resolveDefaultAcademicContext(tx);

    await tx.student.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        enrollment: "",
        address: "",
        skills: [],
        branchId: academic.branchId,
        batchId: academic.batchId,
      },
    });

    return tx.student.findFirst({
      where: { userId },
      include: {
        user: true,
        branch: true,
        batch: true,
      },
    });
  });
}

export type ResumeDataJson = {
  skills?: string[];
  education?: { degree: string; institution: string; year: string }[];
  experience?: {
    role: string;
    company: string;
    duration: string;
    points: string[];
  }[];
  projects?: { name: string; description: string; tech: string }[];
};

export async function updateStudentResume(studentId: string, data: { cgpa?: string; resumeData?: ResumeDataJson }) {
  return client.student.update({
    where: { id: studentId },
    data: {
      ...(data.cgpa !== undefined && { cgpa: data.cgpa }),
      ...(data.resumeData !== undefined && { resumeData: data.resumeData as any }),
    },
  });
}

export async function createResume(data: {
  studentId: string;
  templateId: string;
  filePath: string;
  name?: string;
}) {
  return client.resume.create({
    data: {
      studentId: data.studentId,
      templateId: data.templateId,
      filePath: data.filePath,
      name: data.name,
    },
  });
}

export async function getResumesByStudentId(studentId: string) {
  return client.resume.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getResumeById(id: string) {
  return client.resume.findUnique({
    where: { id },
    include: { student: true },
  });
}
