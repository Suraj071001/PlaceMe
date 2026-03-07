import type { PrismaClient } from "../generated/prisma/client";

type BatchSeed = {
  id: string;
  name: string;
};

type BranchSeed = {
  id: string;
  name: string;
  batches: BatchSeed[];
};

type DepartmentSeed = {
  id: string;
  name: string;
  branches: BranchSeed[];
};

const ACADEMIC_SEED: DepartmentSeed[] = [
  {
    id: "dept-engineering",
    name: "Engineering",
    branches: [
      {
        id: "branch-cse",
        name: "Computer Science",
        batches: [
          { id: "batch-2024", name: "2024" },
          { id: "batch-2025", name: "2025" },
          { id: "batch-2026", name: "2026" },
        ],
      },
      {
        id: "branch-ece",
        name: "Electronics and Communication",
        batches: [
          { id: "batch-ece-2024", name: "2024" },
          { id: "batch-ece-2025", name: "2025" },
        ],
      },
    ],
  },
  {
    id: "dept-management",
    name: "Management",
    branches: [
      {
        id: "branch-mba",
        name: "MBA",
        batches: [
          { id: "batch-mba-2024", name: "2024" },
          { id: "batch-mba-2025", name: "2025" },
        ],
      },
    ],
  },
];

export const DEFAULT_DEPARTMENT_ID = "dept-engineering";
export const DEFAULT_BRANCH_ID = "branch-cse";
export const DEFAULT_BATCH_ID = "batch-2024";

export async function seedAcademics(db: PrismaClient) {
  for (const department of ACADEMIC_SEED) {
    await db.department.upsert({
      where: { id: department.id },
      update: { name: department.name },
      create: {
        id: department.id,
        name: department.name,
      },
    });

    for (const branch of department.branches) {
      await db.branch.upsert({
        where: { id: branch.id },
        update: {
          name: branch.name,
          departmentId: department.id,
        },
        create: {
          id: branch.id,
          name: branch.name,
          departmentId: department.id,
        },
      });

      for (const batch of branch.batches) {
        await db.batch.upsert({
          where: { id: batch.id },
          update: {
            name: batch.name,
            branchId: branch.id,
          },
          create: {
            id: batch.id,
            name: batch.name,
            branchId: branch.id,
          },
        });
      }
    }
  }

  const department = await db.department.findUniqueOrThrow({
    where: { id: DEFAULT_DEPARTMENT_ID },
  });
  const branch = await db.branch.findUniqueOrThrow({
    where: { id: DEFAULT_BRANCH_ID },
  });
  const batch = await db.batch.findUniqueOrThrow({
    where: { id: DEFAULT_BATCH_ID },
  });

  return { department, branch, batch };
}
