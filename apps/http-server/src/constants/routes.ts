export const API_VERSION = {
  V1: "/api/v1",
};
export const ROUTES = {
    AUTH: {
        SIGNUP: "/auth/signup",
        SIGNIN: "/auth/signin",
    },
    COMPANY: {
        BASE: "/company",
        BRANCH_OPTIONS: "/company/branches",
        BY_ID: "/company/:id",
    },
    HR_CONTACT: {
        BASE: "/hrcontact",
        BY_ID: "/hrcontact/:id",
    },
    JOB: {
        BASE: "/job",
        BY_ID: "/job/:id",
        ELIGIBILITY: "/job/eligibility",
    },
    DEPARTMENT: {
        BASE: "/department",
        BY_ID: "/department/:id",
    },
    STUDENT: {
        PROFILE: "/student/profile",
        BY_ID: "/student/by-id/:id",
        NOTIFICATIONS: "/student/notifications",
        NOTIFICATION_READ: "/student/notifications/:id/read",
        RESUME_PROFILE: "/student/resume-profile",
        RESUME_GENERATE_PDF: "/student/resume/generate-pdf",
    },
    STUDENT_APPLICATION: {
        BASE: "/student-application",
        BY_ID: "/student-application/:id",
        APPLY: "/student-application/apply",
        FORM_BY_JOB: "/student-application/job/:jobId/form",
        MINE: "/student-application/mine",
    },
    FORM_RESPONSE: {
        BASE: "/form-response",
        BY_APPLICATION_ID: "/form-response/application/:applicationId",
    },
    RESUME: {
        PROFILE: "/student/resume-profile",
        GENERATE_PDF: "/student/resume/generate-pdf",
        AI_GENERATE: "/student/resume/ai-generate",
        RESUMES_LIST: "/student/resumes",
        UPLOAD_FILE: "/student/resumes/upload",
        RESUME_FILE: "/student/resumes/:id/file",
    },
    ROLE: {
        BASE: "/role",
        BY_ID: "/role/:id",
    },
    PERMISSION: {
        BASE: "/permission",
        BY_ID: "/permission/:id",
    },
    ROLE_PERMISSION: {
        BASE: "/role-permission",
        BY_ROLE: "/role-permission/role/:roleId",
        BY_PERMISSION: "/role-permission/permission/:permissionId",
    },
    ADMIN_USER: {
        BASE: "/admins",
        BY_ID: "/admins/:id",
    },
    ADMIN_APPLICATION: {
        BY_JOB: "/admin-applications/job/:jobId",
        UPDATE_STAGE: "/admin-applications/:id/stage",
        FORM_RESPONSE: "/admin-applications/:id/form-response",
    },
    ANALYTICS: {
        STATS: "/analytics/stats",
        DEPARTMENTS: "/analytics/departments",
        RECENT_ACTIVITY: "/analytics/recent-activity",
        ACTIVITY: "/analytics/activity",
        AUDIT_LOGS: "/analytics/audit-logs",
        UPCOMING_EVENTS: "/analytics/upcoming-events",
    },
    INTEGRATION: {
        BASE: "/integrations",
        CONNECT: "/integrations/:provider/connect",
        DISCONNECT: "/integrations/:provider/disconnect",
        GOOGLE_CHAT_SPACES: "/integration/google-chat/spaces",
    },
    REPORT: {
        BASE: "/reports",
        GENERATE: "/reports/generate",
        DOWNLOAD: "/reports/download/:type",
    },
};
