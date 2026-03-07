import client from "../index";

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

  const getPermission = (name: string) =>
    permissionRecords.find((p) => p.name === name)!;

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
  DEPARTMENT
  ========================
  */

  const department = await client.department.upsert({
    where: { id: "dept-engineering" },
    update: {},
    create: {
      id: "dept-engineering",
      name: "Engineering",
    },
  });

  /*
  ========================
  BRANCH
  ========================
  */

  const branch = await client.branch.upsert({
    where: { id: "branch-cse" },
    update: {},
    create: {
      id: "branch-cse",
      name: "Computer Science",
      departmentId: department.id,
    },
  });

  /*
  ========================
  BATCH
  ========================
  */

  const batch = await client.batch.upsert({
    where: { id: "batch-2024" },
    update: {},
    create: {
      id: "batch-2024",
      name: "2024",
      branchId: branch.id,
    },
  });

  /*
  ========================
  GOOGLE CHAT CONFIG
  ========================
  */

  await client.googleChatConfig.upsert({
    where: { batchId: batch.id },
    update: {},
    create: {
      batchId: batch.id,
      webhookUrl: "https://chat.googleapis.com/test-webhook",
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
      firstName: "Student",
      lastName: "User",
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
