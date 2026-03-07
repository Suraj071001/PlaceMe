"use client";

import { useMemo, useState } from "react";
import { Sparkles, Rocket, Building2, Wand2, Loader2, Save, RefreshCw, CheckCircle2, Cpu, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  generateAiResume,
  updateResumeProfile,
  type GeneratedAiResume,
  type GenerateAiResumePayload,
  type UpdateResumeProfilePayload,
} from "./resume-api";

const toneOptions: Array<{ value: GenerateAiResumePayload["tone"]; label: string; subtitle: string }> = [
  { value: "impact", label: "Impact", subtitle: "Results-first, strong quantified bullets" },
  { value: "ats", label: "ATS", subtitle: "Keyword-rich for screening systems" },
  { value: "concise", label: "Concise", subtitle: "Compact and clean for one-page resumes" },
];

export function AiResumeStudioTab() {
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [tone, setTone] = useState<GenerateAiResumePayload["tone"]>("impact");
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeExperience, setIncludeExperience] = useState(true);
  const [extraContext, setExtraContext] = useState("");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<GeneratedAiResume | null>(null);

  const qualityScore = useMemo(() => {
    if (!result) return 0;
    let score = 50;
    if (result.skills.length >= 8) score += 15;
    if (result.experience.length >= 1) score += 15;
    if (result.projects.length >= 2) score += 10;
    if (result.experience.some((e) => e.points.length >= 2)) score += 10;
    return Math.min(score, 100);
  }, [result]);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      alert("Enter a target role first.");
      return;
    }

    setGenerating(true);
    try {
      const generated = await generateAiResume({
        targetRole: targetRole.trim(),
        targetCompany: targetCompany.trim() || undefined,
        tone,
        includeProjects,
        includeExperience,
        extraContext: extraContext.trim() || undefined,
      });
      setResult(generated);
    } catch (error: any) {
      alert(error?.message || "AI generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const payload: UpdateResumeProfilePayload = {
        cgpa: result.cgpa,
        skills: result.skills,
        education: result.education,
        experience: result.experience,
        projects: result.projects,
      };
      const ok = await updateResumeProfile(payload);
      if (!ok) {
        alert("Could not save generated content to resume profile.");
        return;
      }
      alert("AI resume content saved. Open Generate Resume tab to export PDF.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 overflow-hidden shadow-lg">
        <div className="bg-[linear-gradient(120deg,#4f46e5_0%,#6366f1_45%,#0f172a_100%)] p-[1px]">
          <div className="bg-slate-950 text-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-200">AI Resume Studio</p>
                <h2 className="mt-2 text-2xl sm:text-3xl leading-tight" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif" }}>
                  Build a recruiter-grade resume in under 60 seconds
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Tailored for your target role with ATS language, impact bullets, and structured sections ready to save and export.
                </p>
              </div>
              <div className="rounded-xl border border-indigo-300/40 bg-indigo-200/10 px-4 py-3 text-right">
                <div className="text-[11px] uppercase tracking-[0.2em] text-indigo-200">Output Score</div>
                <div className="text-3xl font-semibold text-indigo-100">{qualityScore || "--"}</div>
                <div className="text-xs text-indigo-200/90">AI Quality Index</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.45fr] gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="w-4 h-4 text-amber-600" />
              Generation Inputs
            </CardTitle>
            <CardDescription>Tell the AI what role and style you are targeting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target role</label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Software Engineer Intern, Data Analyst, Product Intern..."
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target company (optional)</label>
              <Input value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} placeholder="Google, Atlassian, Amazon..." />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Tone</label>
              <div className="grid grid-cols-1 gap-2">
                {toneOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      tone === option.value
                        ? "border-amber-500 bg-amber-50 text-amber-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={includeExperience} onChange={(e) => setIncludeExperience(e.target.checked)} />
                Include experience section
              </label>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={includeProjects} onChange={(e) => setIncludeProjects(e.target.checked)} />
                Include projects section
              </label>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">Extra context (optional)</label>
              <textarea
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                rows={6}
                placeholder="Hackathons, specific achievements, leadership, target domain, preferred keywords..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={generating} className="bg-amber-600 text-white hover:bg-amber-700 gap-2">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate AI Resume
              </Button>
              <Button
                variant="outline"
                disabled={generating}
                onClick={() => {
                  setResult(null);
                  setExtraContext("");
                }}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="w-4 h-4 text-indigo-600" />
              AI Output Preview
            </CardTitle>
            <CardDescription>Review and save this directly into your resume profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/70">
                <Rocket className="w-10 h-10 mx-auto text-slate-400" />
                <h3 className="mt-3 text-sm font-semibold text-slate-700">No AI output yet</h3>
                <p className="mt-1 text-sm text-slate-500">Run generation to get improved skills, bullets, projects and section content.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border bg-gradient-to-r from-emerald-50 to-teal-50 p-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-emerald-800 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    AI draft ready for <span className="font-semibold">{targetRole}</span>
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save to Profile
                  </Button>
                </div>

                <section className="rounded-lg border p-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-amber-600" /> Skills ({result.skills.length})</h4>
                  <p className="mt-2 text-sm text-slate-700">{result.skills.join(" • ")}</p>
                </section>

                <section className="rounded-lg border p-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-600" /> Experience ({result.experience.length})</h4>
                  <div className="mt-2 space-y-3">
                    {result.experience.length === 0 && <p className="text-sm text-slate-500">No experience generated.</p>}
                    {result.experience.map((exp, idx) => (
                      <article key={idx} className="rounded-md bg-slate-50 p-3">
                        <p className="text-sm font-medium text-slate-800">{exp.role} · {exp.company}</p>
                        <p className="text-xs text-slate-500">{exp.duration}</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc pl-5">
                          {exp.points.map((point, pointIdx) => (
                            <li key={pointIdx}>{point}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border p-3">
                  <h4 className="text-sm font-semibold">Projects ({result.projects.length})</h4>
                  <div className="mt-2 space-y-2">
                    {result.projects.length === 0 && <p className="text-sm text-slate-500">No projects generated.</p>}
                    {result.projects.map((project, idx) => (
                      <article key={idx} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                        <p className="font-medium text-slate-800">{project.name}</p>
                        <p className="mt-1">{project.description}</p>
                        <p className="mt-1 text-xs text-slate-500">Tech: {project.tech}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
