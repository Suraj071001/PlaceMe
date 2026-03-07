import client from "../index";

async function main() {
    /*
          PERMISSIONS
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
          ROLES
        */
    const adminRole = await client.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: {
            name: "ADMIN",
            description: "System Administrator",
            isDefault: false,
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
            isDefault: false,
        },
    });

    const interviewerRole = await client.role.upsert({
        where: { name: "INTERVIEWER" },
        update: {},
        create: {
            name: "INTERVIEWER",
            description: "Interview panel member",
            isDefault: false,
        },
    });

    /*
          ROLE PERMISSIONS
        */
    // ROLE PERMISSIONS
    const getPermission = (name: string) => permissionRecords.find((p) => p.name === name)!;

    const rolePermissions = [
        // STUDENT
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
        {
            roleId: studentRole.id,
            permissionId: getPermission("READ_PROFILE").id,
        },

        // RECRUITER
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

        // INTERVIEWER
        {
            roleId: interviewerRole.id,
            permissionId: getPermission("READ_APPLICATION_ADMIN").id,
        },

        // ADMIN → all permissions
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

    // ADMIN USER SETUP
    const hashedPassword = await Bun.password.hash("admin123", {
        algorithm: "bcrypt",
    });

    const adminUser = await client.user.upsert({
        where: { email: "admin@placeme.com" },
        update: {
            password: hashedPassword,
        },
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

    // MOCK DATA SETUP
    const company = await client.company.upsert({
        where: { name: "Placeme Inc" },
        update: {},
        create: {
            name: "Placeme Inc",
            domain: "placeme.com",
            status: "CONTACTED",
            tier: "DREAM",
        },
    });

    let department = await client.department.findFirst({
        where: { name: "Engineering", companyId: company.id },
    });
    if (!department) {
        department = await client.department.create({
            data: {
                name: "Engineering",
                companyId: company.id,
            },
        });
    }

    const hrContactCount = await client.hRContact.count({
        where: { companyId: company.id },
    });
    if (hrContactCount === 0) {
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

    const jobCount = await client.job.count({ where: { companyId: company.id } });
    if (jobCount === 0) {
        await client.job.create({
            data: {
                companyId: company.id,
                departmentId: department.id,
                title: "Software Development Engineer II",
                slug: "sde-2-placeme",
                description: "Looking for an SDE-2 to join the Core Tech team.",
                location: "Remote",
                employmentType: "FULL_TIME",
                workMode: "Remote",
                ctc: "20-25 LPA",
                minimumCGPA: 7.5,
                passingYear: 2024,
                role: "SDE-2",
                isOpen: true,
                status: "ACTIVE",
                additionalDetails: {
                    responsibilities: [
                        "Design, develop, and maintain scalable software solutions.",
                        "Collaborate with cross-functional teams to define and implement new features.",
                    ],
                    qualifications: [
                        "Bachelor's degree in Computer Science or related field.",
                    ],
                },
                openAt: new Date(),
                closeAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                tier: "DREAM",
            },
        });
    }

    /*
        SEED DUMMY STUDENT & ADMIN
      */
    const dummyPassword = await Bun.password.hash("password123", {
        algorithm: "bcrypt",
    });

    const dummyAdmin = await client.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            firstName: "Admin",
            lastName: "User",
            password: dummyPassword,
            isActive: false, // <--- So we can test OTP
            roleId: adminRole.id,
        },
    });

    const dummyStudent = await client.user.upsert({
        where: { email: "suraj24mca@gmail.com" },
        update: {},
        create: {
            email: "suraj24mca@gmail.com",
            firstName: "Student",
            lastName: "User",
            password: dummyPassword,
            isActive: false, // <--- So we can test OTP
            roleId: studentRole.id,
        },
    });

    // Create a dummy Branch and Batch for the student
    const dummyBranch = await client.branch.upsert({
        where: { id: "dummy-branch-id" },
        update: {},
        create: {
            id: "dummy-branch-id",
            name: "Computer Science",
            departmentId: department.id
        }
    });

    const dummyBatch = await client.batch.upsert({
        where: { id: "dummy-batch-id" },
        update: {},
        create: {
            id: "dummy-batch-id",
            name: "2024",
            branchId: dummyBranch.id
        }
    });

    // Create the Student profile for the dummy student
    await client.student.upsert({
        where: { userId: dummyStudent.id },
        update: {},
        create: {
            userId: dummyStudent.id,
            enrollment: "ENR-12345",
            address: "123 Student Rd",
            branchId: dummyBranch.id,
            batchId: dummyBatch.id,
            email: "suraj24mca@gmail.com"
        }
    });

    console.log("Dummy Users seeding completed");
    console.log("RBAC and Mock Data seeding completed");
    console.log("====================================");
    console.log("Admin Credentials:");
    console.log("Email: admin@placeme.com");
    console.log("Password: admin123");
    console.log("====================================");


    console.log("Dummy Users seeding completed 🚀");
    console.log("RBAC and Mock Data seeding completed 🚀");
    console.log("====================================");
    console.log("Admin Credentials:");
    console.log("Email: admin@placeme.com");
    console.log("Password: admin123");
    console.log("====================================");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
