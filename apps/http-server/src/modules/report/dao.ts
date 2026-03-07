import client from "@repo/db/index";

export type ReportType = "Placement" | "Department" | "Company";

type ReportListItem = {
  id: number;
  title: string;
  description: string;
  generatedAt: string;
  type: ReportType;
  file: string;
};

const reportTypeOrder: ReportType[] = ["Placement", "Department", "Company"];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: Array<Array<unknown>>): string {
  const headerLine = headers.map(csvEscape).join(",");
  const rowLines = rows.map((row) => row.map(csvEscape).join(","));
  return [headerLine, ...rowLines].join("\n");
}

export const getReportsDAO = async (): Promise<ReportListItem[]> => {
  const [applicationsCount, hiredOffersCount, departmentsCount, companiesCount] = await Promise.all([
    client.application.count({ where: { deletedAt: null } }),
    client.offer.count({ where: { status: "HIRED", deletedAt: null } }),
    client.department.count({ where: { deletedAt: null } }),
    client.company.count({ where: { deletedAt: null } }),
  ]);

  const now = formatDate(new Date());

  const descriptions: Record<ReportType, string> = {
    Placement: `Overall placement summary (${hiredOffersCount} hires, ${applicationsCount} applications)`,
    Department: `Department-wise placement analysis across ${departmentsCount} departments`,
    Company: `Recruiter engagement insights across ${companiesCount} companies`,
  };

  return reportTypeOrder.map((type, index) => ({
    id: index + 1,
    title: `${type} Report`,
    description: descriptions[type],
    generatedAt: now,
    type,
    file: `/reports/download/${type}`,
  }));
};

export const generateReportDAO = async (data: { type: ReportType }) => {
  return {
    id: Math.floor(Math.random() * 1000) + 100,
    title: `${data.type} Report (Generated)`,
    description: "Custom generated report",
    generatedAt: formatDate(new Date()),
    type: data.type,
    file: `/reports/download/${data.type}`,
  };
};

export const downloadReportCsvDAO = async (type: ReportType): Promise<{ filename: string; csv: string }> => {
  const now = new Date();
  const dateTag = now.toISOString().slice(0, 10);

  if (type === "Placement") {
    const applications = await client.application.findMany({
      where: { deletedAt: null },
      include: {
        student: {
          include: {
            user: true,
            branch: { include: { department: true } },
            batch: true,
          },
        },
        job: {
          include: {
            company: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const csv = toCsv(
      [
        "Application ID",
        "Applied At",
        "Status",
        "Student",
        "Student Email",
        "Enrollment",
        "Department",
        "Branch",
        "Batch",
        "Company",
        "Job Title",
        "Job Role",
        "CTC",
        "Employment Type",
      ],
      applications.map((app) => [
        app.id,
        app.createdAt.toISOString(),
        app.status,
        `${app.student.user.firstName ?? ""} ${app.student.user.lastName ?? ""}`.trim() || app.student.user.email,
        app.student.user.email,
        app.student.enrollment,
        app.student.branch.department.name,
        app.student.branch.name,
        app.student.batch.name,
        app.job.company.name,
        app.job.title,
        app.job.role,
        app.job.ctc ?? "",
        app.job.employmentType,
      ]),
    );

    return { filename: `placement-report-${dateTag}.csv`, csv };
  }

  if (type === "Department") {
    const departments = await client.department.findMany({
      where: { deletedAt: null },
      include: {
        branches: {
          include: {
            students: true,
            batches: true,
          },
        },
        jobs: {
          where: { deletedAt: null },
          include: {
            applications: {
              where: { deletedAt: null },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const csv = toCsv(
      [
        "Department ID",
        "Department Name",
        "Branches",
        "Batches",
        "Students",
        "Jobs",
        "Applications",
      ],
      departments.map((dept) => {
        const branchCount = dept.branches.length;
        const batchCount = dept.branches.reduce((sum, branch) => sum + branch.batches.length, 0);
        const studentCount = dept.branches.reduce((sum, branch) => sum + branch.students.length, 0);
        const jobCount = dept.jobs.length;
        const applicationCount = dept.jobs.reduce((sum, job) => sum + job.applications.length, 0);

        return [
          dept.id,
          dept.name,
          branchCount,
          batchCount,
          studentCount,
          jobCount,
          applicationCount,
        ];
      }),
    );

    return { filename: `department-report-${dateTag}.csv`, csv };
  }

  const companies = await client.company.findMany({
    where: { deletedAt: null },
    include: {
      branch: { include: { department: true } },
      jobs: {
        where: { deletedAt: null },
        include: {
          applications: {
            where: { deletedAt: null },
          },
          offers: {
            where: { deletedAt: null },
          },
        },
      },
      offers: {
        where: { deletedAt: null },
      },
    },
    orderBy: { name: "asc" },
  });

  const csv = toCsv(
    [
      "Company ID",
      "Company",
      "Industry",
      "Department",
      "Branch",
      "Jobs",
      "Applications",
      "Offers",
      "Hired Offers",
      "Status",
      "Created At",
    ],
    companies.map((company) => {
      const jobsCount = company.jobs.length;
      const applicationsCount = company.jobs.reduce((sum, job) => sum + job.applications.length, 0);
      const offersCount = company.offers.length;
      const hiredOffersCount = company.offers.filter((offer) => offer.status === "HIRED").length;

      return [
        company.id,
        company.name,
        company.industry,
        company.branch.department.name,
        company.branch.name,
        jobsCount,
        applicationsCount,
        offersCount,
        hiredOffersCount,
        company.status,
        company.createdAt.toISOString(),
      ];
    }),
  );

  return { filename: `company-report-${dateTag}.csv`, csv };
};
