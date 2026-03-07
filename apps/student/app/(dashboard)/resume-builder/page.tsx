"use client";

import { useState } from "react";
import { Upload, FileEdit, Eye, Pencil, Sparkles } from "lucide-react";
import { UploadResumeTab } from "./upload-resume-tab";
import { GenerateResumeTab } from "./generate-resume-tab";
import { MyResumesTab } from "./my-resumes-tab";
import { ResumeEditorTab } from "./resume-editor-tab";
import { AiResumeStudioTab } from "./ai-resume-studio-tab";

export default function ResumeBuilderPage() {
    const [activeTab, setActiveTab] = useState<"upload" | "edit" | "generate" | "my-resumes" | "ai-studio">("edit");

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resume Builder</h1>
                <p className="text-gray-500 mt-1">Upload, create, and manage your professional resumes</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`
              whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "upload"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
                    >
                        <Upload className="w-4 h-4" />
                        Upload Resume
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`
              whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "edit"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Resume
                    </button>
                    <button
                        onClick={() => setActiveTab("generate")}
                        className={`
              whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "generate"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
                    >
                        <FileEdit className="w-4 h-4" />
                        Generate Resume
                    </button>
                    <button
                        onClick={() => setActiveTab("ai-studio")}
                        className={`
              whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "ai-studio"
                                ? "border-amber-500 text-amber-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Studio
                    </button>
                    <button
                        onClick={() => setActiveTab("my-resumes")}
                        className={`
              whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "my-resumes"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
                    >
                        <Eye className="w-4 h-4" />
                        My Resumes
                    </button>
                </nav>
            </div>

            <div className="mt-4">
                {activeTab === "upload" && <UploadResumeTab />}
                {activeTab === "edit" && <ResumeEditorTab />}
                {activeTab === "generate" && <GenerateResumeTab />}
                {activeTab === "ai-studio" && <AiResumeStudioTab />}
                {activeTab === "my-resumes" && <MyResumesTab />}
            </div>
        </div>
    );
}
