"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, Eye, Download, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";
import { listResumes, openResumeInNewTab, downloadResumeById, uploadResumeFile, type ResumeListItem } from "./resume-api";

export function UploadResumeTab() {
    const [resumes, setResumes] = useState<ResumeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const loadResumes = () => {
        listResumes()
            .then(setResumes)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadResumes();
    }, []);

    return (
        <div className="space-y-6">
            <Card className="border-dashed border-2 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-gray-500 mb-2">Upload a PDF resume and keep it in your resume library.</p>
                    <p className="text-sm text-gray-400 mb-6">Supported format: PDF, up to 8MB.</p>
                    <label className={`inline-flex cursor-pointer items-center rounded-md px-4 py-2 text-white min-w-[170px] justify-center ${uploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        {uploading ? "Uploading..." : "Choose PDF"}
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            disabled={uploading}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.currentTarget.value = "";
                                if (!file) return;
                                setUploadError(null);
                                setUploading(true);
                                try {
                                    await uploadResumeFile(file);
                                    setLoading(true);
                                    loadResumes();
                                } catch (error: any) {
                                    setUploadError(error?.message || "Failed to upload resume.");
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                    </label>
                    {uploadError && <p className="text-sm text-red-600 mt-3">{uploadError}</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg font-medium">Recent Resumes From Backend</CardTitle>
                    <CardDescription>Loaded from your saved resumes API.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-6 text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    ) : resumes.length === 0 ? (
                        <p className="text-sm text-gray-500 py-3">No resumes found. Generate one to see it here.</p>
                    ) : (
                        <div className="space-y-3">
                            {resumes.slice(0, 5).map((resume) => (
                                <RecentResumeRow key={resume.id} resume={resume} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function RecentResumeRow({ resume }: { resume: ResumeListItem }) {
    const [viewLoading, setViewLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const date = resume.createdAt
        ? new Date(resume.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "-";

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-indigo-100/50 rounded flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{resume.name ?? `Resume - ${resume.templateId}`}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 capitalize">{resume.templateId}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{date}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={viewLoading}
                    onClick={async () => {
                        setViewLoading(true);
                        await openResumeInNewTab(resume.id);
                        setViewLoading(false);
                    }}
                >
                    {viewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    View
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={downloadLoading}
                    onClick={async () => {
                        setDownloadLoading(true);
                        await downloadResumeById(resume.id, resume.name ? `${resume.name}.pdf` : undefined);
                        setDownloadLoading(false);
                    }}
                >
                    {downloadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download
                </Button>
            </div>
        </div>
    );
}
