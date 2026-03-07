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
        BY_ID: "/company/:id",
    },
    HR_CONTACT: {
        BASE: "/hrcontact",
        BY_ID: "/hrcontact/:id",
    },
    JOB: {
        BASE: "/job",
        BY_ID: "/job/:id",
    },
    DEPARTMENT: {
        BASE: "/department",
        BY_ID: "/department/:id",
    },
    STUDENT: {
        PROFILE: "/student/profile",
        BY_ID: "/student/:id",
        RESUME_PROFILE: "/student/resume-profile",
        RESUME_GENERATE_PDF: "/student/resume/generate-pdf",
    },
    STUDENT_APPLICATION: {
        BASE: "/student-application",
        BY_ID: "/student-application/:id",
        APPLY: "/student-application/apply",
        MINE: "/student-application/mine",
    },
    FORM_RESPONSE: {
        BASE: "/form-response",
        BY_APPLICATION_ID: "/form-response/application/:applicationId",
    },
    RESUME: {
        PROFILE: "/student/resume-profile",
        GENERATE_PDF: "/student/resume/generate-pdf",
        RESUMES_LIST: "/student/resumes",
        RESUME_FILE: "/student/resumes/:id/file",
    },
};