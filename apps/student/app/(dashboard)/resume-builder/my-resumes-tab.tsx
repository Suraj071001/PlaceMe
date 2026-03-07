"use client";

import { useEffect, useState } from "react";
import { FileText, Eye, Download, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { listResumes, openResumeInNewTab, downloadResumeById, type ResumeListItem } from "./resume-api";

export function MyResumesTab() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listResumes()
      .then(setResumes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full min-h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-base font-semibold">
              My Resumes ({resumes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : resumes.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                No resumes yet. Generate one from the &quot;Generate Resume&quot; tab.
              </p>
            ) : (
              <div className="space-y-3">
                {resumes.map((r) => (
                  <ResumeCard key={r.id} resume={r} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="h-full min-h-[500px] flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center text-center p-8">
            <FileText className="w-16 h-16 text-gray-300 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your generated resumes</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Each time you download a PDF from the Generate tab, it is saved here. Use View to open in a new tab or Download to save again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResumeCard({ resume }: { resume: ResumeListItem }) {
  const [viewLoading, setViewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const date = resume.createdAt
    ? new Date(resume.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors">
      <div className="flex gap-3 min-w-0">
        <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {resume.name ?? `Resume - ${resume.templateId}`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">{resume.templateId}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={viewLoading}
          onClick={async () => {
            setViewLoading(true);
            await openResumeInNewTab(resume.id);
            setViewLoading(false);
          }}
          title="View"
        >
          {viewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={downloadLoading}
          onClick={async () => {
            setDownloadLoading(true);
            await downloadResumeById(resume.id, resume.name ? `${resume.name}.pdf` : undefined);
            setDownloadLoading(false);
          }}
          title="Download"
        >
          {downloadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
