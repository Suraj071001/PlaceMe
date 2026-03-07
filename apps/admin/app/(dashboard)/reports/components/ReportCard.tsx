"use client";

import { Download, FileText, Eye } from "lucide-react";
import { useState } from "react";

type Report = {
  id: number;
  title: string;
  description: string;
  generatedAt: string;
  type: "Placement" | "Department" | "Company";
  file: string;
};

export default function ReportCard({ report, apiBase }: { report: Report; apiBase: string }) {
  const [loading, setLoading] = useState<"view" | "download" | null>(null);

  const buildUrl = () => {
    const filePath = report.file.startsWith("/") ? report.file : `/${report.file}`;
    return `${apiBase}${filePath}`;
  };

  const fetchReportBlob = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(buildUrl(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(`Failed to download report (${res.status})`);
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get("content-disposition") || "";
    const match = contentDisposition.match(/filename="?([^\"]+)"?/i);
    const filename = match?.[1] || `${report.type.toLowerCase()}-report.csv`;

    return { blob, filename };
  };

  const onDownload = async () => {
    setLoading("download");
    try {
      const { blob, filename } = await fetchReportBlob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to download report. Check server and login token.");
    } finally {
      setLoading(null);
    }
  };

  const onView = async () => {
    setLoading("view");
    try {
      const { blob } = await fetchReportBlob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      console.error(error);
      alert("Failed to preview report. Check server and login token.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="flex min-w-0 gap-3 sm:gap-4">
        <div className="w-11 h-11 flex items-center justify-center bg-indigo-100 rounded-lg">
          <FileText size={20} className="text-indigo-600" />
        </div>

        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-slate-800">{report.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{report.description}</p>
          <p className="text-xs text-slate-400 mt-2">Generated: {report.generatedAt}</p>
          <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{report.type}</span>
        </div>
      </div>

      <div className="flex w-full gap-2 sm:w-auto">
        <button
          onClick={onView}
          disabled={loading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          <Eye size={16} />
          {loading === "view" ? "Opening..." : "View"}
        </button>

        <button
          onClick={onDownload}
          disabled={loading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          <Download size={16} />
          {loading === "download" ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}
