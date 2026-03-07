"use client";

import { JSX, useState, useEffect } from "react";
import { FileEdit, ArrowLeft, Download, LayoutTemplate, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import {
  DUMMY_RESUME_PROFILE,
  RESUME_TEMPLATES,
  type ResumeTemplateId,
  type StudentResumeProfile,
} from "./resume-data";
import { getResumeProfile, downloadResumePdf } from "./resume-api";
import {
  ResumeTemplateModern,
  ResumeTemplateClassic,
  ResumeTemplateMinimal,
  ResumeTemplateProfessional,
} from "./resume-templates";

const TEMPLATE_COMPONENTS: Record<
  ResumeTemplateId,
  (props: { profile: StudentResumeProfile }) => JSX.Element
> = {
  modern: ResumeTemplateModern,
  classic: ResumeTemplateClassic,
  minimal: ResumeTemplateMinimal,
  professional: ResumeTemplateProfessional,
};

export function GenerateResumeTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId | null>(null);
  const [profile, setProfile] = useState<StudentResumeProfile>(DUMMY_RESUME_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    getResumeProfile()
      .then((p) => {
        if (p) setProfile(p);
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const handleDownloadPdf = async () => {
    if (!selectedTemplate) return;
    setPdfLoading(true);
    try {
      const ok = await downloadResumePdf(selectedTemplate);
      if (!ok) alert("Failed to download PDF. Check that you are logged in and have a student profile.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile summary - data used for resume */}
      <Card className="bg-slate-50/80 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-indigo-600" />
            Profile used for resume
          </CardTitle>
          <CardDescription>
            {profileLoading ? "Loading profile…" : "Resume is generated from your profile data."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {profileLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span><strong>{profile.fullName}</strong></span>
            <span>{profile.branch} · {profile.year}</span>
            <span>CGPA {profile.cgpa}</span>
            <span>{profile.rollNumber}</span>
            <span>{profile.skills.length} skills</span>
            <span>{profile.experience.length} experience entries</span>
            <span>{profile.projects.length} projects</span>
          </div>
          )}
        </CardContent>
      </Card>

      {selectedTemplate === null ? (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose a template</h3>
            <p className="text-sm text-gray-500">Select a design to generate your resume. You can change it anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESUME_TEMPLATES.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-indigo-200 border-2 overflow-hidden"
                onClick={() => setSelectedTemplate(t.id)}
              >
                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <LayoutTemplate className="w-12 h-12 text-slate-400" />
                </div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription className="text-xs">{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(t.id);
                    }}
                  >
                    Use this template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Choose another template
            </Button>
            <Button
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={pdfLoading}
              onClick={handleDownloadPdf}
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download PDF
            </Button>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-gray-50/50">
              <CardTitle className="text-base">Preview — {RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</CardTitle>
              <CardDescription>This is how your resume will look. PDF download will be available after backend is connected.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[70vh] overflow-auto bg-gray-100 p-6 md:p-8">
                <div className="shadow-xl rounded-sm overflow-hidden bg-white">
                  {TEMPLATE_COMPONENTS[selectedTemplate]({ profile })}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
