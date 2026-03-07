import type { Request } from "express";
import client from "@repo/db/index";

export const getAuthenticatedStudentId = async (req: Request) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const student = await client.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) {
    throw new Error("Student profile not found for authenticated user");
  }

  return student.id;
};
