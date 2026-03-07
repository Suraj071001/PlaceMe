/**
 * Dummy student profile data for resume builder (frontend-only).
 * Replace with API later.
 */

export type StudentResumeProfile = {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    points: string[];
  }[];
  projects: { name: string; description: string; tech: string }[];
};

export const DUMMY_RESUME_PROFILE: StudentResumeProfile = {
  fullName: "Rahul Kumar",
  email: "rahul.kumar@college.edu",
  phone: "+91 98765 43210",
  rollNumber: "19BCS0123",
  branch: "Computer Science & Engineering",
  year: "2025",
  cgpa: "8.6",
  skills: ["React", "Node.js", "Python", "SQL", "System Design", "Git"],
  education: [
    { degree: "B.Tech", institution: "ABC College of Engineering", year: "2021 - 2025" },
  ],
  experience: [
    {
      role: "SDE Intern",
      company: "Tech Corp",
      duration: "May 2024 - Jul 2024",
      points: [
        "Built REST APIs for the onboarding module serving 10k+ users.",
        "Improved query performance by 40% using indexing and query optimization.",
      ],
    },
    {
      role: "Web Dev Intern",
      company: "StartupXYZ",
      duration: "Dec 2023 - Feb 2024",
      points: [
        "Developed dashboard UI with React and integrated with backend APIs.",
      ],
    },
  ],
  projects: [
    {
      name: "PlaceMe - Placement Portal",
      description: "Full-stack portal for companies and students to manage placements, applications, and job postings.",
      tech: "Next.js, Prisma, PostgreSQL, Redis",
    },
    {
      name: "Expense Tracker CLI",
      description: "CLI tool to log and categorize expenses with monthly reports.",
      tech: "Python, SQLite",
    },
  ],
};

export type ResumeTemplateId = "modern" | "classic" | "minimal" | "professional";

export const RESUME_TEMPLATES: { id: ResumeTemplateId; name: string; description: string }[] = [
  { id: "modern", name: "Modern", description: "Clean layout with clear sections" },
  { id: "classic", name: "Classic", description: "Traditional single-column format" },
  { id: "minimal", name: "Minimal", description: "Lots of whitespace, simple typography" },
  { id: "professional", name: "Professional", description: "Bold header, subtle accents" },
];
