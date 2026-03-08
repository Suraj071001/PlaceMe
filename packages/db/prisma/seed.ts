import client, { ApplicationStatus } from "../index";
import { seedAcademics } from "./seed-academics";

async function seedNotificationsForUser(userId: string) {
  await client.notification.deleteMany({ where: { userId } });

  await client.notification.createMany({
    data: [
      {
        userId,
        type: "job",
        payload: {
          title: "New job posted",
          desc: "Google has posted a new position: Software Engineer",
        },
        isRead: false,
      },
      {
        userId,
        type: "application",
        payload: {
          title: "Application shortlisted",
          desc: "Your application for Microsoft - Product Manager has been shortlisted",
        },
        isRead: false,
      },
      {
        userId,
        type: "interview",
        payload: {
          title: "Interview scheduled",
          desc: "Interview scheduled for Amazon on March 12, 2026 at 10:00 AM",
        },
        isRead: true,
      },
      {
        userId,
        type: "reminder",
        payload: {
          title: "Application deadline approaching",
          desc: "Apply for Netflix - Backend Engineer before March 25, 2026",
        },
        isRead: true,
      },
      {
        userId,
        type: "profile",
        payload: {
          title: "Profile update reminder",
          desc: "Update your resume and skills to improve profile strength",
        },
        isRead: true,
      },
    ],
  });
}

async function main() {
  /*
  ========================
  PERMISSIONS
  ========================
  */

  const permissions = [
    { name: "READ_JOBS", description: "View job listings" },
    { name: "READ_COMPANY", description: "View company details" },
    { name: "DELETE_COMPANY", description: "Delete company" },
    { name: "APPLY_JOB", description: "Apply to jobs" },
    { name: "READ_APPLICATION", description: "View application" },
    { name: "UPDATE_PROFILE", description: "Update profile" },
    { name: "CREATE_COMPANY", description: "Create company" },
    { name: "EDIT_COMPANY", description: "Edit company" },
    { name: "CREATE_DEPARTMENT", description: "Create department" },
    { name: "READ_DEPARTMENT", description: "View department details" },
    { name: "UPDATE_DEPARTMENT", description: "Update department" },
    { name: "DELETE_DEPARTMENT", description: "Delete department" },
    { name: "CREATE_HR_CONTACT", description: "Create HR contact" },
    { name: "READ_HR_CONTACT", description: "View HR contact details" },
    { name: "UPDATE_HR_CONTACT", description: "Update HR contact" },
    { name: "DELETE_HR_CONTACT", description: "Delete HR contact" },
    { name: "CREATE_JOB", description: "Create job" },
    { name: "EDIT_JOB", description: "Edit job" },
    { name: "DELETE_JOB", description: "Delete job" },
    { name: "READ_APPLICATION_ADMIN", description: "View all applications" },
    {
      name: "MOVE_APPLICATION_STAGE",
      description: "Move application pipeline stage",
    },
    { name: "SEND_OFFER", description: "Send offer to candidate" },
    { name: "MANAGE_USERS", description: "Manage users" },
    { name: "READ_REPORTS", description: "View reports" },
    { name: "READ_PROFILE", description: "View profile" },
    { name: "CREATE_ROLE", description: "Create roles" },
    { name: "READ_ROLE", description: "View roles" },
    { name: "UPDATE_ROLE", description: "Update roles" },
    { name: "DELETE_ROLE", description: "Delete roles" },
    { name: "READ_PERMISSION", description: "View permissions" },
    { name: "CREATE_PERMISSION", description: "Create permissions" },
    { name: "UPDATE_PERMISSION", description: "Update permissions" },
    { name: "DELETE_PERMISSION", description: "Delete permissions" },
    { name: "MANAGE_USER_ROLE", description: "Manage user roles" },
    { name: "MANAGE_ROLE_PERMISSION", description: "Manage role permissions" },
    { name: "READ_ROLE_PERMISSION", description: "View role permissions" },
    { name: "MANAGE_ADMIN_USERS", description: "Manage admin users" },
    { name: "READ_ADMIN_USERS", description: "View admin users" },

    {
      name: "READ_GOOGLE_CHAT_CONFIG",
      description: "View Google Chat configuration",
    },
    {
      name: "MANAGE_GOOGLE_CHAT_CONFIG",
      description: "Manage Google Chat configuration",
    },
    { name: "READ_DEPARTMENT", description: "View department details" },
    { name: "READ_BRANCH", description: "View branch details" },
  ];

  const permissionRecords: any[] = [];

  for (const permission of permissions) {
    const record = await client.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });

    permissionRecords.push(record);
  }

  /*
  ========================
  ROLES
  ========================
  */

  const adminRole = await client.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "System Administrator",
    },
  });

  const studentRole = await client.role.upsert({
    where: { name: "STUDENT" },
    update: {},
    create: {
      name: "STUDENT",
      description: "Default student role",
      isDefault: true,
    },
  });

  const recruiterRole = await client.role.upsert({
    where: { name: "RECRUITER" },
    update: {},
    create: {
      name: "RECRUITER",
      description: "Company recruiter",
    },
  });

  const interviewerRole = await client.role.upsert({
    where: { name: "INTERVIEWER" },
    update: {},
    create: {
      name: "INTERVIEWER",
      description: "Interview panel member",
    },
  });

  /*
  ========================
  ROLE PERMISSIONS
  ========================
  */

  const getPermission = (name: string) => permissionRecords.find((p) => p.name === name)!;

  const rolePermissions = [
    { roleId: studentRole.id, permissionId: getPermission("READ_JOBS").id },
    { roleId: studentRole.id, permissionId: getPermission("APPLY_JOB").id },
    {
      roleId: studentRole.id,
      permissionId: getPermission("READ_APPLICATION").id,
    },
    {
      roleId: studentRole.id,
      permissionId: getPermission("UPDATE_PROFILE").id,
    },
    { roleId: studentRole.id, permissionId: getPermission("READ_PROFILE").id },

    { roleId: recruiterRole.id, permissionId: getPermission("CREATE_JOB").id },
    { roleId: recruiterRole.id, permissionId: getPermission("EDIT_JOB").id },
    { roleId: recruiterRole.id, permissionId: getPermission("READ_JOBS").id },
    { roleId: recruiterRole.id, permissionId: getPermission("READ_COMPANY").id },
    {
      roleId: recruiterRole.id,
      permissionId: getPermission("READ_APPLICATION_ADMIN").id,
    },
    {
      roleId: recruiterRole.id,
      permissionId: getPermission("MOVE_APPLICATION_STAGE").id,
    },
    { roleId: recruiterRole.id, permissionId: getPermission("SEND_OFFER").id },

    {
      roleId: interviewerRole.id,
      permissionId: getPermission("READ_APPLICATION_ADMIN").id,
    },

    ...permissionRecords.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
  ];

  for (const rp of rolePermissions) {
    await client.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: rp.roleId,
          permissionId: rp.permissionId,
        },
      },
      update: {},
      create: rp,
    });
  }

  /*
  ========================
  ADMIN USER
  ========================
  */

  const hashedPassword = await Bun.password.hash("admin123", {
    algorithm: "bcrypt",
  });

  await client.user.upsert({
    where: { email: "admin@placeme.com" },
    update: {},
    create: {
      email: "admin@placeme.com",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      roleId: adminRole.id,
      isActive: true,
      phone: "+1234567890",
    },
  });

  const extraAdmins = [
    {
      email: "operations.admin@placeme.com",
      firstName: "Operations",
      lastName: "Admin",
      phone: "+1234567891",
    },
    {
      email: "placements.admin@placeme.com",
      firstName: "Placements",
      lastName: "Lead",
      phone: "+1234567892",
    },
  ];

  for (const extraAdmin of extraAdmins) {
    await client.user.upsert({
      where: { email: extraAdmin.email },
      update: {},
      create: {
        email: extraAdmin.email,
        password: hashedPassword,
        firstName: extraAdmin.firstName,
        lastName: extraAdmin.lastName,
        roleId: adminRole.id,
        isActive: true,
        phone: extraAdmin.phone,
      },
    });
  }

  /*
  ========================
  DEPARTMENT / BRANCH / BATCH
  ========================
  */

  const { department, branch, batch } = await seedAcademics(client);

  /*
  ========================
  GOOGLE CHAT CONFIG
  ========================
  */

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-2024" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQALBSr0Lc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ovyK_GCPMA7Y98As-gsPW37ncijNeVNm5KTmoXNu9ZQ",
      isActive: true,
    },
    create: {
      batchId: "batch-2024",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQALBSr0Lc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ovyK_GCPMA7Y98As-gsPW37ncijNeVNm5KTmoXNu9ZQ",
      isActive: true,
    },
  });

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-2025" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQA-EjRVt4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=l-3lkV8l0kGD5bgmzsJTtOM_fRMpJLwTSajaYyYEYbg",
      isActive: true,
    },
    create: {
      batchId: "batch-2025",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQA-EjRVt4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=l-3lkV8l0kGD5bgmzsJTtOM_fRMpJLwTSajaYyYEYbg",
      isActive: true,
    },
  });

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-2026" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAXnrMqm4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=sH1XQdJQeWL_MwAdgxFJMGJyM3jK5gG52GO2PPMBJTY",
      isActive: true,
    },
    create: {
      batchId: "batch-2026",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAXnrMqm4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=sH1XQdJQeWL_MwAdgxFJMGJyM3jK5gG52GO2PPMBJTY",
      isActive: true,
    },
  });

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-ece-2024" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAyYX4QOA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=4Iz4uf5e--q5W6cDln4mEObl4M73NjKumYGxNap6bWk",
      isActive: true,
    },
    create: {
      batchId: "batch-ece-2024",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAyYX4QOA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=4Iz4uf5e--q5W6cDln4mEObl4M73NjKumYGxNap6bWk",
      isActive: true,
    },
  });

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-ece-2025" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAfNbhau8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ryji76bz4KYLLm7n1vNor24PXi36329mxzVm7lyq9jg",
      isActive: true,
    },
    create: {
      batchId: "batch-ece-2025",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAfNbhau8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ryji76bz4KYLLm7n1vNor24PXi36329mxzVm7lyq9jg",
      isActive: true,
    },
  });

  await client.googleChatConfig.upsert({
    where: { batchId: "batch-mba-2024" },
    update: {
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAofdmP3Y/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=OMgVXGO2PhRkH_rz-Fi6wSrDJ842gob_-rcrBN_Lcv4",
      isActive: true,
    },
    create: {
      batchId: "batch-mba-2024",
      webhookUrl:
        "https://chat.googleapis.com/v1/spaces/AAQAofdmP3Y/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=OMgVXGO2PhRkH_rz-Fi6wSrDJ842gob_-rcrBN_Lcv4",
      isActive: true,
    },
  });

  /*
  ========================
  COMPANY
  ========================
  */

  const company = await client.company.upsert({
    where: { name: "Placeme Inc" },
    update: {},
    create: {
      name: "Placeme Inc",
      domain: "placeme.com",
      industry: "Software",
      faculty_coordinator: "Prof Sharma",
      status: "CONTACTED",
      branchId: branch.id,
    },
  });

  /*
  ========================
  HR CONTACT
  ========================
  */

  const existingHRContact = await client.hRContact.findFirst({
    where: { email: "hr@placeme.com", companyId: company.id },
  });

  if (!existingHRContact) {
    await client.hRContact.create({
      data: {
        name: "John HR",
        email: "hr@placeme.com",
        phone: "9876543210",
        designation: "HR_MANAGER",
        companyId: company.id,
      },
    });
  }

  /*
  ========================
  JOB
  ========================
  */

  const job = await client.job.upsert({
    where: { slug: "sde-2-placeme" },
    update: {},
    create: {
      companyId: company.id,
      departmentId: department.id,
      title: "Software Development Engineer II",
      slug: "sde-2-placeme",
      description: "Looking for an SDE-2 to join the Core Tech team.",
      location: "Remote",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "20-25 LPA",
      minimumCGPA: 7.5,
      passingYear: 2024,
      role: "SDE-2",
      status: "ACTIVE",
      openAt: new Date(),
      closeAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      batches: {
        connect: { id: batch.id },
      },
    },
  });

  // Create a second job
  const job2 = await client.job.upsert({
    where: { slug: "frontend-dev-google" },
    update: {},
    create: {
      companyId: company.id,
      departmentId: department.id,
      title: "Frontend Developer",
      slug: "frontend-dev-google",
      description: "Exciting opportunity for a Frontend Developer to work on cutting-edge web applications.",
      location: "Bangalore",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "15-20 LPA",
      minimumCGPA: 7.0,
      passingYear: 2024,
      role: "Frontend Developer",
      status: "ACTIVE",
      openAt: new Date(),
      closeAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      batches: {
        connect: { id: batch.id },
      },
    },
  });

  // Additional companies for richer admin dashboards
  const extraCompanies = [
    {
      name: "Nimbus Systems",
      domain: "nimbus.systems",
      industry: "Cloud Infrastructure",
      faculty_coordinator: "Prof Deb",
      status: "INTERESTED" as const,
      branchId: "branch-cse",
      hr: {
        name: "Riya Menon",
        email: "riya.hr@nimbus.systems",
        designation: "HR_MANAGER" as const,
      },
      jobs: [
        {
          slug: "nimbus-backend-engineer",
          title: "Backend Engineer",
          role: "Backend Engineer",
          location: "Bangalore",
          workMode: "HYBRID",
          ctc: "18-24 LPA",
          minimumCGPA: 7.0,
          passingYear: 2025,
          batches: ["batch-2024", "batch-2025"],
        },
        {
          slug: "nimbus-site-reliability-intern",
          title: "Site Reliability Intern",
          role: "SRE Intern",
          location: "Remote",
          workMode: "REMOTE",
          ctc: "8-10 LPA",
          minimumCGPA: 6.8,
          passingYear: 2026,
          batches: ["batch-2026"],
        },
      ],
    },
    {
      name: "VoltEdge Electronics",
      domain: "voltedge.io",
      industry: "Embedded & Hardware",
      faculty_coordinator: "Prof Choudhury",
      status: "CONTACTED" as const,
      branchId: "branch-ece",
      hr: {
        name: "Arun Nair",
        email: "arun.hr@voltedge.io",
        designation: "TECH_RECRUITER" as const,
      },
      jobs: [
        {
          slug: "voltedge-embedded-engineer",
          title: "Embedded Software Engineer",
          role: "Embedded Engineer",
          location: "Pune",
          workMode: "ONSITE",
          ctc: "12-18 LPA",
          minimumCGPA: 6.5,
          passingYear: 2025,
          batches: ["batch-ece-2024", "batch-ece-2025"],
        },
      ],
    },
    {
      name: "Aster Fintech",
      domain: "asterfintech.com",
      industry: "FinTech",
      faculty_coordinator: "Prof Das",
      status: "INTERESTED" as const,
      branchId: "branch-mba",
      hr: {
        name: "Nikita Rao",
        email: "nikita.hr@asterfintech.com",
        designation: "CAMPUS_RECRUITER" as const,
      },
      jobs: [
        {
          slug: "aster-business-analyst",
          title: "Business Analyst",
          role: "Business Analyst",
          location: "Mumbai",
          workMode: "HYBRID",
          ctc: "10-14 LPA",
          minimumCGPA: 6.0,
          passingYear: 2025,
          batches: ["batch-mba-2024", "batch-mba-2025"],
        },
      ],
    },
    {
      name: "Quantum Labs",
      domain: "quantumlabs.ai",
      industry: "AI/ML",
      faculty_coordinator: "Prof Nath",
      status: "INTERESTED" as const,
      branchId: "branch-cse",
      hr: {
        name: "Saket Jain",
        email: "saket.hr@quantumlabs.ai",
        designation: "TECH_RECRUITER" as const,
      },
      jobs: [
        {
          slug: "quantum-ml-engineer",
          title: "ML Engineer",
          role: "ML Engineer",
          location: "Hyderabad",
          workMode: "HYBRID",
          ctc: "20-28 LPA",
          minimumCGPA: 7.2,
          passingYear: 2025,
          batches: ["batch-2024", "batch-2025"],
        },
      ],
    },
    {
      name: "BlueOrbit Tech",
      domain: "blueorbit.tech",
      industry: "SaaS",
      faculty_coordinator: "Prof Saha",
      status: "CONTACTED" as const,
      branchId: "branch-cse",
      hr: {
        name: "Kiran Patel",
        email: "kiran.hr@blueorbit.tech",
        designation: "RECRUITER" as const,
      },
      jobs: [
        {
          slug: "blueorbit-fullstack-engineer",
          title: "Full Stack Engineer",
          role: "Full Stack Engineer",
          location: "Remote",
          workMode: "REMOTE",
          ctc: "14-19 LPA",
          minimumCGPA: 6.8,
          passingYear: 2026,
          batches: ["batch-2025", "batch-2026"],
        },
      ],
    },
    {
      name: "PixelBridge",
      domain: "pixelbridge.design",
      industry: "Design & Product",
      faculty_coordinator: "Prof Roy",
      status: "INTERESTED" as const,
      branchId: "branch-cse",
      hr: {
        name: "Ananya Das",
        email: "ananya.hr@pixelbridge.design",
        designation: "CAMPUS_RECRUITER" as const,
      },
      jobs: [
        {
          slug: "pixelbridge-product-designer",
          title: "Product Designer",
          role: "Product Designer",
          location: "Bangalore",
          workMode: "ONSITE",
          ctc: "9-13 LPA",
          minimumCGPA: 6.0,
          passingYear: 2025,
          batches: ["batch-2024", "batch-2025"],
        },
      ],
    },
    {
      name: "SecureStack",
      domain: "securestack.dev",
      industry: "Cyber Security",
      faculty_coordinator: "Prof Kar",
      status: "CONTACTED" as const,
      branchId: "branch-cse",
      hr: {
        name: "Farhan Ali",
        email: "farhan.hr@securestack.dev",
        designation: "SENIOR_RECRUITER" as const,
      },
      jobs: [
        {
          slug: "securestack-security-analyst",
          title: "Security Analyst",
          role: "Security Analyst",
          location: "Noida",
          workMode: "HYBRID",
          ctc: "11-16 LPA",
          minimumCGPA: 6.5,
          passingYear: 2026,
          batches: ["batch-2025", "batch-2026"],
        },
      ],
    },
    {
      name: "GreenGrid Energy",
      domain: "greengrid.energy",
      industry: "Energy Tech",
      faculty_coordinator: "Prof Barman",
      status: "INTERESTED" as const,
      branchId: "branch-ece",
      hr: {
        name: "Megha Iyer",
        email: "megha.hr@greengrid.energy",
        designation: "HR_MANAGER" as const,
      },
      jobs: [
        {
          slug: "greengrid-iot-engineer",
          title: "IoT Engineer",
          role: "IoT Engineer",
          location: "Chennai",
          workMode: "ONSITE",
          ctc: "10-14 LPA",
          minimumCGPA: 6.2,
          passingYear: 2025,
          batches: ["batch-ece-2024", "batch-ece-2025"],
        },
      ],
    },
    {
      name: "DataSpring Analytics",
      domain: "dataspring.io",
      industry: "Data Analytics",
      faculty_coordinator: "Prof Khandelwal",
      status: "CONTACTED" as const,
      branchId: "branch-mba",
      hr: {
        name: "Rohit Khanna",
        email: "rohit.hr@dataspring.io",
        designation: "RECRUITER" as const,
      },
      jobs: [
        {
          slug: "dataspring-operations-analyst",
          title: "Operations Analyst",
          role: "Operations Analyst",
          location: "Kolkata",
          workMode: "HYBRID",
          ctc: "8-12 LPA",
          minimumCGPA: 6.0,
          passingYear: 2025,
          batches: ["batch-mba-2024", "batch-mba-2025"],
        },
      ],
    },
  ];

  const seededExtraJobs: { id: string; companyName: string; slug: string }[] = [];

  for (const extraCompany of extraCompanies) {
    const createdCompany = await client.company.upsert({
      where: { name: extraCompany.name },
      update: {},
      create: {
        name: extraCompany.name,
        domain: extraCompany.domain,
        industry: extraCompany.industry,
        faculty_coordinator: extraCompany.faculty_coordinator,
        status: extraCompany.status,
        branchId: extraCompany.branchId,
      },
    });

    const existingExtraHr = await client.hRContact.findFirst({
      where: {
        companyId: createdCompany.id,
        email: extraCompany.hr.email,
      },
    });

    if (!existingExtraHr) {
      await client.hRContact.create({
        data: {
          name: extraCompany.hr.name,
          email: extraCompany.hr.email,
          designation: extraCompany.hr.designation,
          phone: "9000000000",
          companyId: createdCompany.id,
        },
      });
    }

    for (const extraJob of extraCompany.jobs) {
      const createdJob = await client.job.upsert({
        where: { slug: extraJob.slug },
        update: {},
        create: {
          companyId: createdCompany.id,
          departmentId: department.id,
          title: extraJob.title,
          slug: extraJob.slug,
          description: `${extraJob.title} role at ${extraCompany.name}.`,
          location: extraJob.location,
          employmentType: "FULL_TIME",
          workMode: extraJob.workMode,
          ctc: extraJob.ctc,
          minimumCGPA: extraJob.minimumCGPA,
          passingYear: extraJob.passingYear,
          role: extraJob.role,
          status: "ACTIVE",
          openAt: new Date(),
          closeAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          batches: {
            connect: extraJob.batches.map((batchId) => ({ id: batchId })),
          },
          google_chat: true,
          email: true,
        },
      });

      seededExtraJobs.push({
        id: createdJob.id,
        companyName: extraCompany.name,
        slug: extraJob.slug,
      });
    }
  }

  /*
  ========================
  ACTIVITY + AUDIT LOGS
  ========================
  */

  const now = Date.now();
  const seededActivityTypes = ["JOB_CREATED", "JOB_UPDATED", "JOB_DELETED", "PIPELINE_MOVED", "OFFER_RELEASED"];
  const seededAuditActions = ["JOB_CREATED", "JOB_UPDATED", "JOB_DELETED", "APPLICATION_REVIEWED", "REPORT_GENERATED"];

  await client.activity.deleteMany({
    where: {
      companyId: company.id,
      type: {
        in: seededActivityTypes,
      },
    },
  });

  await client.auditLog.deleteMany({
    where: {
      companyId: company.id,
      action: {
        in: seededAuditActions,
      },
    },
  });

  await client.activity.createMany({
    data: [
      {
        companyId: company.id,
        type: "JOB_CREATED",
        body: `Job "${job.title}" created`,
        metadata: { jobId: job.id, role: job.role },
        createdAt: new Date(now - 1000 * 60 * 50),
      },
      {
        companyId: company.id,
        type: "JOB_UPDATED",
        body: `Job "${job.title}" eligibility criteria updated`,
        metadata: { jobId: job.id, updatedFields: ["minimumCGPA", "batchIds"] },
        createdAt: new Date(now - 1000 * 60 * 40),
      },
      {
        companyId: company.id,
        type: "PIPELINE_MOVED",
        body: "2 candidates moved to Interview stage",
        metadata: { stage: "Interview", count: 2 },
        createdAt: new Date(now - 1000 * 60 * 25),
      },
      {
        companyId: company.id,
        type: "OFFER_RELEASED",
        body: "Offer letters released for shortlisted candidates",
        metadata: { offers: 2 },
        createdAt: new Date(now - 1000 * 60 * 15),
      },
      {
        companyId: company.id,
        type: "JOB_DELETED",
        body: 'Archived draft job "Associate Analyst"',
        metadata: { reason: "Duplicate draft cleanup" },
        createdAt: new Date(now - 1000 * 60 * 10),
      },
    ],
  });

  await client.auditLog.createMany({
    data: [
      {
        companyId: company.id,
        action: "JOB_CREATED",
        meta: { jobId: job.id, title: job.title, actor: "admin@placeme.com" },
        createdAt: new Date(now - 1000 * 60 * 50),
      },
      {
        companyId: company.id,
        action: "JOB_UPDATED",
        meta: { jobId: job.id, changes: ["ctc", "passingYear"], actor: "admin@placeme.com" },
        createdAt: new Date(now - 1000 * 60 * 40),
      },
      {
        companyId: company.id,
        action: "APPLICATION_REVIEWED",
        meta: { applicationsReviewed: 6, actor: "recruiter@placeme.com" },
        createdAt: new Date(now - 1000 * 60 * 30),
      },
      {
        companyId: company.id,
        action: "REPORT_GENERATED",
        meta: { reportType: "department-analysis", actor: "admin@placeme.com" },
        createdAt: new Date(now - 1000 * 60 * 20),
      },
      {
        companyId: company.id,
        action: "JOB_DELETED",
        meta: { title: "Associate Analyst", actor: "admin@placeme.com" },
        createdAt: new Date(now - 1000 * 60 * 10),
      },
    ],
  });

  /*
  ========================
  APPLICATION FORM
  ========================
  */

  let form = await client.applicationForm.findFirst({
    where: {
      title: "Default Job Application",
      departmentId: department.id,
    },
  });

  if (!form) {
    form = await client.applicationForm.create({
      data: {
        title: "Default Job Application",
        isDefault: true,
        departmentId: department.id,
        jobs: {
          connect: [{ id: job.id }, { id: job2.id }],
        },
      },
    });

    const section = await client.formSection.create({
      data: {
        title: "Basic Information",
        order: 1,
        formId: form.id,
      },
    });

    await client.formQuestion.createMany({
      data: [
        {
          label: "Why should we hire you?",
          type: "LONG_TEXT",
          order: 1,
          required: true,
          sectionId: section.id,
        },
        {
          label: "LinkedIn Profile",
          type: "URL",
          order: 2,
          required: false,
          sectionId: section.id,
        },
      ],
    });
  }

  /*
  ========================
  STUDENT USER
  ========================
  */

  const dummyPassword = await Bun.password.hash("password123", {
    algorithm: "bcrypt",
  });

  const studentUser = await client.user.upsert({
    where: { email: "suraj24mca@gmail.com" },
    update: {},
    create: {
      email: "suraj24mca@gmail.com",
      firstName: "Suraj",
      lastName: "Kumar",
      password: dummyPassword,
      roleId: studentRole.id,
      isActive: false,
    },
  });

  /*
  ========================
  STUDENT PROFILE
  ========================
  */

  await client.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      enrollment: "ENR-12345",
      address: "123 Student Rd",
      skills: ["React", "Node.js"],
      branchId: branch.id,
      batchId: batch.id,
      email: "suraj24mca@gmail.com",
    },
  });

  /*
  ========================
  MORE STUDENTS
  ========================
  */

  const studentsData = [
    {
      email: "alice.johnson@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      enrollment: "ENR-67890",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Python", "Django"],
    },
    {
      email: "bob.smith@example.com",
      firstName: "Bob",
      lastName: "Smith",
      enrollment: "ENR-54321",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Java", "Spring"],
    },
    {
      email: "charlie.brown@example.com",
      firstName: "Charlie",
      lastName: "Brown",
      enrollment: "ENR-09876",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["JavaScript", "React"],
    },
    {
      email: "diana.prince@example.com",
      firstName: "Diana",
      lastName: "Prince",
      enrollment: "ENR-13579",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["C++", "Data Structures"],
    },
    {
      email: "eve.adams@example.com",
      firstName: "Eve",
      lastName: "Adams",
      enrollment: "ENR-24680",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["SQL", "Database Design"],
    },
    {
      email: "frank.miller@example.com",
      firstName: "Frank",
      lastName: "Miller",
      enrollment: "ENR-11223",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Go", "Kubernetes"],
    },
    {
      email: "grace.lee@example.com",
      firstName: "Grace",
      lastName: "Lee",
      enrollment: "ENR-33445",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Ruby", "Rails"],
    },
    {
      email: "henry.wilson@example.com",
      firstName: "Henry",
      lastName: "Wilson",
      enrollment: "ENR-55667",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["PHP", "Laravel"],
    },
    {
      email: "iris.davis@example.com",
      firstName: "Iris",
      lastName: "Davis",
      enrollment: "ENR-77889",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Swift", "iOS Development"],
    },
    {
      email: "jack.garcia@example.com",
      firstName: "Jack",
      lastName: "Garcia",
      enrollment: "ENR-99001",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["Kotlin", "Android"],
    },
    {
      email: "kate.martinez@example.com",
      firstName: "Kate",
      lastName: "Martinez",
      enrollment: "ENR-22334",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["TypeScript", "Angular"],
    },
    {
      email: "liam.rodriguez@example.com",
      firstName: "Liam",
      lastName: "Rodriguez",
      enrollment: "ENR-44556",
      branchId: branch.id,
      batchId: batch.id,
      skills: ["C#", ".NET"],
    },
    {
      email: "maya.sen@example.com",
      firstName: "Maya",
      lastName: "Sen",
      enrollment: "ENR-44557",
      branchId: "branch-cse",
      batchId: "batch-2025",
      skills: ["Rust", "Distributed Systems"],
    },
    {
      email: "noah.paul@example.com",
      firstName: "Noah",
      lastName: "Paul",
      enrollment: "ENR-44558",
      branchId: "branch-cse",
      batchId: "batch-2026",
      skills: ["Next.js", "TypeScript"],
    },
    {
      email: "olivia.roy@example.com",
      firstName: "Olivia",
      lastName: "Roy",
      enrollment: "ENR-44559",
      branchId: "branch-ece",
      batchId: "batch-ece-2024",
      skills: ["VLSI", "MATLAB"],
    },
    {
      email: "pranav.kale@example.com",
      firstName: "Pranav",
      lastName: "Kale",
      enrollment: "ENR-44560",
      branchId: "branch-ece",
      batchId: "batch-ece-2025",
      skills: ["Embedded C", "RTOS"],
    },
    {
      email: "qiana.bose@example.com",
      firstName: "Qiana",
      lastName: "Bose",
      enrollment: "ENR-44561",
      branchId: "branch-mba",
      batchId: "batch-mba-2024",
      skills: ["Market Research", "Excel"],
    },
    {
      email: "rahul.dev@example.com",
      firstName: "Rahul",
      lastName: "Dev",
      enrollment: "ENR-44562",
      branchId: "branch-mba",
      batchId: "batch-mba-2025",
      skills: ["Business Strategy", "Power BI"],
    },
    {
      email: "sana.iqbal@example.com",
      firstName: "Sana",
      lastName: "Iqbal",
      enrollment: "ENR-44563",
      branchId: "branch-cse",
      batchId: "batch-2024",
      skills: ["Data Science", "Pandas"],
    },
    {
      email: "tanvi.kapoor@example.com",
      firstName: "Tanvi",
      lastName: "Kapoor",
      enrollment: "ENR-44564",
      branchId: "branch-cse",
      batchId: "batch-2025",
      skills: ["Flutter", "Dart"],
    },
    {
      email: "umang.gupta@example.com",
      firstName: "Umang",
      lastName: "Gupta",
      enrollment: "ENR-44565",
      branchId: "branch-ece",
      batchId: "batch-ece-2024",
      skills: ["Signal Processing", "Python"],
    },
    {
      email: "vani.shah@example.com",
      firstName: "Vani",
      lastName: "Shah",
      enrollment: "ENR-44566",
      branchId: "branch-mba",
      batchId: "batch-mba-2024",
      skills: ["Finance", "Operations"],
    },
  ];

  const createdStudents = [];
  for (const studentData of studentsData) {
    const user = await client.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        password: dummyPassword,
        roleId: studentRole.id,
        isActive: true,
      },
    });

    const student = await client.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        enrollment: studentData.enrollment,
        address: "456 College Ave",
        skills: studentData.skills,
        branchId: studentData.branchId,
        batchId: studentData.batchId,
        email: studentData.email,
      },
    });

    createdStudents.push(student);
  }

  /*
  ========================
  APPLICATIONS
  ========================
  */

  // Create or get pipeline for the company
  let pipeline = await client.pipeline.findFirst({
    where: { companyId: company.id },
  });

  if (!pipeline) {
    pipeline = await client.pipeline.create({
      data: {
        companyId: company.id,
        name: "Default Pipeline",
      },
    });
  }

  // Get stages for the pipeline
  const stages = await client.stage.findMany({
    where: { pipelineId: pipeline.id },
  });

  if (stages.length === 0) {
    // Create default stages if none exist
    const defaultStages = [
      { name: "Applied", sortOrder: 1 },
      { name: "Screening", sortOrder: 2 },
      { name: "Phone Screen", sortOrder: 3 },
      { name: "Online Assessment", sortOrder: 4 },
      { name: "Shortlisted", sortOrder: 5 },
      { name: "Interview", sortOrder: 6 },
      { name: "Technical Interview", sortOrder: 7 },
      { name: "HR Interview", sortOrder: 8 },
      { name: "Final Round", sortOrder: 9 },
      { name: "Offer", sortOrder: 10 },
      { name: "Selected", sortOrder: 11 },
      { name: "Hired", sortOrder: 12 },
      { name: "Rejected", sortOrder: 13 },
      { name: "Archived", sortOrder: 14 },
    ];

    for (const stageData of defaultStages) {
      await client.stage.create({
        data: {
          name: stageData.name,
          sortOrder: stageData.sortOrder,
          pipelineId: pipeline.id,
        },
      });
    }
  }

  // Refresh stages
  const updatedStages = await client.stage.findMany({
    where: { pipelineId: pipeline.id },
  });

  // Get all students to ensure they exist
  const allStudents = await client.student.findMany();
  console.log(`Found ${allStudents.length} students in database`);

  if (allStudents.length === 0) {
    console.log("No students found, skipping application creation");
    console.log("🌱 Seed completed successfully");
    return;
  }

  const getStudentIdAt = (index: number) => {
    const student = allStudents[index % allStudents.length];

    if (!student) {
      throw new Error(`Missing seeded student at index ${index}`);
    }

    return student.id;
  };

  // Applications for Job 1 (SDE-2)
  const applicationsDataJob1: Array<{
    studentId: string;
    stageId?: string;
    status: ApplicationStatus;
  }> = [
    {
      studentId: getStudentIdAt(0),
      stageId: updatedStages.find((s) => s.name === "Applied")?.id,
      status: ApplicationStatus.APPLIED,
    },
    {
      studentId: getStudentIdAt(1),
      stageId: updatedStages.find((s) => s.name === "Screening")?.id,
      status: ApplicationStatus.SCREENING,
    },
    {
      studentId: getStudentIdAt(2),
      stageId: updatedStages.find((s) => s.name === "Phone Screen")?.id,
      status: ApplicationStatus.PHONE_SCREEN,
    },
    {
      studentId: getStudentIdAt(3),
      stageId: updatedStages.find((s) => s.name === "Online Assessment")?.id,
      status: ApplicationStatus.SCREENING,
    },
    {
      studentId: getStudentIdAt(4),
      stageId: updatedStages.find((s) => s.name === "Shortlisted")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(5),
      stageId: updatedStages.find((s) => s.name === "Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(6),
      stageId: updatedStages.find((s) => s.name === "Technical Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(7),
      stageId: updatedStages.find((s) => s.name === "HR Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(8),
      stageId: updatedStages.find((s) => s.name === "Final Round")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(9),
      stageId: updatedStages.find((s) => s.name === "Offer")?.id,
      status: ApplicationStatus.OFFER,
    },
    {
      studentId: getStudentIdAt(10),
      stageId: updatedStages.find((s) => s.name === "Selected")?.id,
      status: ApplicationStatus.HIRED,
    },
    {
      studentId: getStudentIdAt(11),
      stageId: updatedStages.find((s) => s.name === "Hired")?.id,
      status: ApplicationStatus.HIRED,
    },
    {
      studentId: getStudentIdAt(12),
      stageId: updatedStages.find((s) => s.name === "Rejected")?.id,
      status: ApplicationStatus.REJECTED,
    },
    // Additional applications with different statuses
    {
      studentId: getStudentIdAt(0),
      stageId: updatedStages.find((s) => s.name === "Applied")?.id,
      status: ApplicationStatus.APPLIED,
    },
    {
      studentId: getStudentIdAt(1),
      stageId: updatedStages.find((s) => s.name === "Applied")?.id,
      status: ApplicationStatus.APPLIED,
    },
    {
      studentId: getStudentIdAt(2),
      stageId: updatedStages.find((s) => s.name === "Screening")?.id,
      status: ApplicationStatus.SCREENING,
    },
    {
      studentId: getStudentIdAt(3),
      stageId: updatedStages.find((s) => s.name === "Phone Screen")?.id,
      status: ApplicationStatus.PHONE_SCREEN,
    },
    {
      studentId: getStudentIdAt(4),
      stageId: updatedStages.find((s) => s.name === "Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(5),
      stageId: updatedStages.find((s) => s.name === "Offer")?.id,
      status: ApplicationStatus.OFFER,
    },
    {
      studentId: getStudentIdAt(6),
      stageId: updatedStages.find((s) => s.name === "Rejected")?.id,
      status: ApplicationStatus.REJECTED,
    },
    {
      studentId: getStudentIdAt(7),
      stageId: updatedStages.find((s) => s.name === "Archived")?.id,
      status: ApplicationStatus.ARCHIVED,
    },
  ];

  // Applications for Job 2 (Frontend Developer)
  const applicationsDataJob2: Array<{
    studentId: string;
    stageId?: string;
    status: ApplicationStatus;
  }> = [
    {
      studentId: getStudentIdAt(0),
      stageId: updatedStages.find((s) => s.name === "Applied")?.id,
      status: ApplicationStatus.APPLIED,
    },
    {
      studentId: getStudentIdAt(1),
      stageId: updatedStages.find((s) => s.name === "Screening")?.id,
      status: ApplicationStatus.SCREENING,
    },
    {
      studentId: getStudentIdAt(2),
      stageId: updatedStages.find((s) => s.name === "Phone Screen")?.id,
      status: ApplicationStatus.PHONE_SCREEN,
    },
    {
      studentId: getStudentIdAt(3),
      stageId: updatedStages.find((s) => s.name === "Online Assessment")?.id,
      status: ApplicationStatus.SCREENING,
    },
    {
      studentId: getStudentIdAt(4),
      stageId: updatedStages.find((s) => s.name === "Shortlisted")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(5),
      stageId: updatedStages.find((s) => s.name === "Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(6),
      stageId: updatedStages.find((s) => s.name === "Technical Interview")?.id,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      studentId: getStudentIdAt(7),
      stageId: updatedStages.find((s) => s.name === "Offer")?.id,
      status: ApplicationStatus.OFFER,
    },
    {
      studentId: getStudentIdAt(8),
      stageId: updatedStages.find((s) => s.name === "Selected")?.id,
      status: ApplicationStatus.HIRED,
    },
    {
      studentId: getStudentIdAt(9),
      stageId: updatedStages.find((s) => s.name === "Rejected")?.id,
      status: ApplicationStatus.REJECTED,
    },
  ];

  // Create applications for Job 1
  for (const appData of applicationsDataJob1) {
    const application = await client.application.upsert({
      where: {
        studentId_jobId: {
          studentId: appData.studentId,
          jobId: job.id,
        },
      },
      update: {},
      create: {
        jobId: job.id,
        studentId: appData.studentId,
        pipelineId: pipeline.id,
        stageId: appData.stageId,
        status: appData.status,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });

    // Create form response for some applications
    if (form && Math.random() > 0.5) {
      // 50% chance to have form response
      const formResponse = await client.formResponse.upsert({
        where: { applicationId: application.id },
        update: {},
        create: {
          applicationId: application.id,
          formId: form.id,
          studentId: appData.studentId,
        },
      });

      // Get form questions
      const questions = await client.formQuestion.findMany({
        where: { section: { formId: form.id } },
      });

      // Create sample answers
      for (const question of questions) {
        let answerValue = "";
        let answerValues: string[] = [];

        if (question.type === "LONG_TEXT") {
          answerValue = "I am very interested in this position and believe my skills in software development would be a great fit for your team.";
        } else if (question.type === "URL") {
          answerValue = "https://linkedin.com/in/sample-profile";
        }

        await client.formAnswer.upsert({
          where: {
            responseId_questionId: {
              responseId: formResponse.id,
              questionId: question.id,
            },
          },
          update: {},
          create: {
            responseId: formResponse.id,
            questionId: question.id,
            value: answerValue,
            values: answerValues,
          },
        });
      }
    }
  }

  // Create applications for Job 2
  for (const appData of applicationsDataJob2) {
    const application = await client.application.upsert({
      where: {
        studentId_jobId: {
          studentId: appData.studentId,
          jobId: job2.id,
        },
      },
      update: {},
      create: {
        jobId: job2.id,
        studentId: appData.studentId,
        pipelineId: pipeline.id,
        stageId: appData.stageId,
        status: appData.status,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });

    // Create form response for some applications
    if (form && Math.random() > 0.5) {
      // 50% chance to have form response
      const formResponse = await client.formResponse.upsert({
        where: { applicationId: application.id },
        update: {},
        create: {
          applicationId: application.id,
          formId: form.id,
          studentId: appData.studentId,
        },
      });

      // Get form questions
      const questions = await client.formQuestion.findMany({
        where: { section: { formId: form.id } },
      });

      // Create sample answers
      for (const question of questions) {
        let answerValue = "";
        let answerValues: string[] = [];

        if (question.type === "LONG_TEXT") {
          answerValue = "I am very interested in this frontend position and believe my skills in web development would be a great fit for your team.";
        } else if (question.type === "URL") {
          answerValue = "https://linkedin.com/in/frontend-profile";
        }

        await client.formAnswer.upsert({
          where: {
            responseId_questionId: {
              responseId: formResponse.id,
              questionId: question.id,
            },
          },
          update: {},
          create: {
            responseId: formResponse.id,
            questionId: question.id,
            value: answerValue,
            values: answerValues,
          },
        });
      }
    }
  }

  // Create applications for extra company jobs
  for (let jobIndex = 0; jobIndex < seededExtraJobs.length; jobIndex++) {
    const seededJob = seededExtraJobs[jobIndex];
    if (!seededJob) continue;
    const applicants = [
      getStudentIdAt((jobIndex * 2) % allStudents.length),
      getStudentIdAt((jobIndex * 2 + 1) % allStudents.length),
      getStudentIdAt((jobIndex * 2 + 2) % allStudents.length),
    ];

    const statuses: ApplicationStatus[] = [
      ApplicationStatus.APPLIED,
      ApplicationStatus.SCREENING,
      ApplicationStatus.INTERVIEW,
    ];

    for (let idx = 0; idx < applicants.length; idx++) {
      await client.application.upsert({
        where: {
          studentId_jobId: {
            studentId: applicants[idx]!,
            jobId: seededJob.id,
          },
        },
        update: {},
        create: {
          jobId: seededJob.id,
          studentId: applicants[idx]!,
          pipelineId: pipeline.id,
          stageId: updatedStages[idx]?.id,
          status: statuses[idx]!,
          createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
