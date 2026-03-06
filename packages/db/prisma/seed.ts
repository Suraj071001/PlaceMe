import client from "../index";

async function main() {
    /*
      PERMISSIONS
    */
    const permissions = [
        { name: "view_jobs", description: "View job listings" },
        { name: "apply_job", description: "Apply to jobs" },
        { name: "view_application", description: "View application" },
        { name: "update_profile", description: "Update profile" },
        { name: "create_company", description: "Create company" },
        { name: "edit_company", description: "Edit company" },
        { name: "create_job", description: "Create job" },
        { name: "edit_job", description: "Edit job" },
        { name: "delete_job", description: "Delete job" },
        { name: "view_application_admin", description: "View all applications" },
        { name: "move_application_stage", description: "Move application pipeline stage" },
        { name: "send_offer", description: "Send offer to candidate" },
        { name: "manage_users", description: "Manage users" },
        { name: "view_reports", description: "View reports" }
    ];

    const permissionRecords: any[] = [];

    for (const permission of permissions) {
        const record = await client.permission.upsert({
            where: { name: permission.name },
            update: {},
            create: permission
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
            isDefault: false
        }
    });

    const studentRole = await client.role.upsert({
        where: { name: "STUDENT" },
        update: {},
        create: {
            name: "STUDENT",
            description: "Default student role",
            isDefault: true
        }
    });

    const recruiterRole = await client.role.upsert({
        where: { name: "RECRUITER" },
        update: {},
        create: {
            name: "RECRUITER",
            description: "Company recruiter",
            isDefault: false
        }
    });

    const interviewerRole = await client.role.upsert({
        where: { name: "INTERVIEWER" },
        update: {},
        create: {
            name: "INTERVIEWER",
            description: "Interview panel member",
            isDefault: false
        }
    });

    /*
      ROLE PERMISSIONS
    */
    const getPermission = (name: string) =>
        permissionRecords.find((p) => p.name === name)!;

    const rolePermissions = [
        // STUDENT
        { roleId: studentRole.id, permissionId: getPermission("view_jobs").id },
        { roleId: studentRole.id, permissionId: getPermission("apply_job").id },
        { roleId: studentRole.id, permissionId: getPermission("view_application").id },
        { roleId: studentRole.id, permissionId: getPermission("update_profile").id },

        // RECRUITER
        { roleId: recruiterRole.id, permissionId: getPermission("create_job").id },
        { roleId: recruiterRole.id, permissionId: getPermission("edit_job").id },
        { roleId: recruiterRole.id, permissionId: getPermission("view_application_admin").id },
        { roleId: recruiterRole.id, permissionId: getPermission("move_application_stage").id },
        { roleId: recruiterRole.id, permissionId: getPermission("send_offer").id },

        // INTERVIEWER
        { roleId: interviewerRole.id, permissionId: getPermission("view_application_admin").id },

        // ADMIN → all permissions
        ...permissionRecords.map((permission) => ({
            roleId: adminRole.id,
            permissionId: permission.id
        }))
    ];

    for (const rp of rolePermissions) {
        await client.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: rp.roleId,
                    permissionId: rp.permissionId
                }
            },
            update: {},
            create: rp
        });
    }

    console.log("RBAC seeding completed 🚀");

    /*
      SEED DUMMY STUDENT & ADMIN
    */
    const hashedPassword = await Bun.password.hash("password123", {
        algorithm: "bcrypt"
    });

    const dummyAdmin = await client.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            firstName: "Admin",
            lastName: "User",
            password: hashedPassword,
            isActive: false,   // <--- So we can test OTP
            roleId: adminRole.id
        }
    });

    const dummyStudent = await client.user.upsert({
        where: { email: "suraj24mca@gmail.com" },
        update: {},
        create: {
            email: "suraj24mca@gmail.com",
            firstName: "Student",
            lastName: "User",
            password: hashedPassword,
            isActive: false,   // <--- So we can test OTP
            roleId: studentRole.id
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
            registration: "REG-54321",
            branch: "Computer Science",
            email: "suraj24mca@gmail.com"
        }
    });

    console.log("Dummy Users seeding completed 🚀");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
