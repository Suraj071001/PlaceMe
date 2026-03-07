import { getReportsDAO, generateReportDAO } from "./dao";

export const getReportsService = async () => {
    return await getReportsDAO();
};

export const generateReportService = async (data: any) => {
    return await generateReportDAO(data);
};
