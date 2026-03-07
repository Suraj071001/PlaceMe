"use client";

import { Download, FileText, Eye } from "lucide-react";
import { useState } from "react";
import PdfViewer from "./PdfViewer";

export default function ReportCard({ report }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-5">
        {/* Left side */}
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

        {/* Actions */}
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => setOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 sm:flex-none"
          >
            <Eye size={16} />
            View
          </button>

          <a
            href={report.file}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 sm:flex-none"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <PdfViewer open={open} setOpen={setOpen} file={report.file} />
    </>
  );
}
