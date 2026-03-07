import type { Request, Response } from "express";
import { downloadReportCsvService, generateReportService, getReportsService } from "./service";
import type { ReportType } from "./dao";

const VALID_REPORT_TYPES: ReportType[] = ["Placement", "Department", "Company"];

function parseReportType(rawType: string | string[] | undefined): ReportType | null {
  if (!rawType) return null;
  const value = Array.isArray(rawType) ? rawType[0] : rawType;
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "placement") return "Placement";
  if (normalized === "department") return "Department";
  if (normalized === "company") return "Company";
  return null;
}

export const getReportsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await getReportsService();
    res.status(200).json({ success: true, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = parseReportType(req.body?.type);
    if (!type) {
      res.status(400).json({ success: false, message: `Invalid report type. Allowed types: ${VALID_REPORT_TYPES.join(", ")}` });
      return;
    }

    const report = await generateReportService({ type });
    res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = parseReportType(req.params.type);
    if (!type) {
      res.status(400).json({ success: false, message: `Invalid report type. Allowed types: ${VALID_REPORT_TYPES.join(", ")}` });
      return;
    }

    const { filename, csv } = await downloadReportCsvService(type);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
