// Temporary mock data for reports
export const getReportsDAO = async () => {
    return [
        {
            id: 1,
            title: "Placement Summary Report",
            description: "Overall placement statistics and trends",
            generatedAt: "March 1, 2026",
            type: "Placement",
            file: "/reports/placement-summary.pdf",
        },
        {
            id: 2,
            title: "Branch-wise Analysis",
            description: "Department-specific placement performance",
            generatedAt: "March 1, 2026",
            type: "Department",
            file: "/reports/branch-analysis.pdf",
        },
        {
            id: 3,
            title: "Company-wise Report",
            description: "Recruiter engagement and hiring statistics",
            generatedAt: "February 28, 2026",
            type: "Company",
            file: "/reports/company-report.pdf",
        },
    ];
};

export const generateReportDAO = async (data: any) => {
    // Mock generate
    return {
        id: Math.floor(Math.random() * 1000) + 4,
        title: `${data.type} Report (Generated)`,
        description: "Custom generated report",
        generatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        type: data.type,
        file: `/reports/${data.type.toLowerCase()}-generated.pdf`,
    };
};
