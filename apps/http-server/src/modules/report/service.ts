import { downloadReportCsvDAO, generateReportDAO, getReportsDAO, type ReportType } from "./dao";

export const getReportsService = async () => {
  return await getReportsDAO();
};

export const generateReportService = async (data: { type: ReportType }) => {
  return await generateReportDAO(data);
};

export const downloadReportCsvService = async (type: ReportType) => {
  return await downloadReportCsvDAO(type);
};
