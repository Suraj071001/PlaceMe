import client from "../index";
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
    { name: "APPLY_JOB", description: "Apply to jobs" },
    { name: "READ_APPLICATION", description: "View application" },
    { name: "UPDATE_PROFILE", description: "Update profile" },
    { name: "CREATE_COMPANY", description: "Create company" },
    { name: "EDIT_COMPANY", description: "Edit company" },
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
          connect: { id: job.id },
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
