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
