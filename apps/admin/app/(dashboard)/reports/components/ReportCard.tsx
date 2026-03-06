"use client";

import { Download, FileText, Eye } from "lucide-react";
import { useState } from "react";
import PdfViewer from "./PdfViewer";

export default function ReportCard({ report }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-start hover:shadow-sm transition">
        {/* Left side */}
        <div className="flex gap-4">
          <div className="w-11 h-11 flex items-center justify-center bg-indigo-100 rounded-lg">
            <FileText size={20} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="text-[16px] font-semibold text-slate-800">{report.title}</h3>

            <p className="text-sm text-slate-500 mt-1">{report.description}</p>

            <p className="text-xs text-slate-400 mt-2">Generated: {report.generatedAt}</p>

            <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{report.type}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-md text-sm hover:bg-slate-50 cursor-pointer"
          >
            <Eye size={16} />
            View
          </button>

          <a
            href={report.file}
            download
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 cursor-pointer"
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
