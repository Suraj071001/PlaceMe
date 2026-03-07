"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { getResumeProfile, updateResumeProfile, type UpdateResumeProfilePayload } from "./resume-api";
import type { StudentResumeProfile } from "./resume-data";

const emptyEducation = () => ({ degree: "", institution: "", year: "" });
const emptyExperience = () => ({
  role: "",
  company: "",
  duration: "",
  points: [""],
});
const emptyProject = () => ({ name: "", description: "", tech: "" });

export function ResumeEditorTab() {
  const [profile, setProfile] = useState<StudentResumeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<StudentResumeProfile>({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: [],
    education: [emptyEducation()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
  });

  useEffect(() => {
    getResumeProfile().then((p) => {
      if (p) {
        setProfile(p);
        setForm({
          ...p,
          education: p.education.length ? p.education : [emptyEducation()],
          experience: p.experience.length ? p.experience : [emptyExperience()],
          projects: p.projects.length ? p.projects : [emptyProject()],
        });
      }
      setLoading(false);
    });
  }, []);

  const buildPayload = (): UpdateResumeProfilePayload => ({
    cgpa: form.cgpa,
    skills: form.skills.filter(Boolean),
    education: form.education.filter((e) => e.degree.trim() || e.institution.trim() || e.year.trim()),
    experience: form.experience.filter((e) => e.company.trim() || e.role.trim()).map((e) => ({
      ...e,
      points: e.points.filter(Boolean),
    })),
    projects: form.projects.filter((p) => p.name.trim() || p.description.trim() || p.tech.trim()),
  });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const ok = await updateResumeProfile(buildPayload());
    setSaving(false);
    if (ok) setSaved(true);
    else alert("Failed to save. Check that you are logged in and have a student profile.");
  };

  const update = <K extends keyof StudentResumeProfile>(key: K, value: StudentResumeProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEducation = (index: number, field: "degree" | "institution" | "year", value: string) => {
    setForm((prev) => {
      const next = [...prev.education];
      const current = next[index] ?? emptyEducation();
      if (field === "degree") next[index] = { ...current, degree: value };
      if (field === "institution") next[index] = { ...current, institution: value };
      if (field === "year") next[index] = { ...current, year: value };
      return { ...prev, education: next };
    });
  };

  const addEducation = () => setForm((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }));
  const removeEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (
    index: number,
    field: "role" | "company" | "duration" | "points",
    value: string | string[]
  ) => {
    setForm((prev) => {
      const next = [...prev.experience];
      const current = next[index] ?? emptyExperience();
      if (field === "role" && typeof value === "string") next[index] = { ...current, role: value };
      if (field === "company" && typeof value === "string") next[index] = { ...current, company: value };
      if (field === "duration" && typeof value === "string") next[index] = { ...current, duration: value };
      if (field === "points" && Array.isArray(value)) next[index] = { ...current, points: value };
      return { ...prev, experience: next };
    });
  };

  const updateExperiencePoint = (expIndex: number, pointIndex: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.experience];
      const current = next[expIndex] ?? emptyExperience();
      const points = [...current.points];
      points[pointIndex] = value;
      next[expIndex] = { ...current, points };
      return { ...prev, experience: next };
    });
  };

  const addExperiencePoint = (expIndex: number) => {
    setForm((prev) => {
      const next = [...prev.experience];
      const current = next[expIndex] ?? emptyExperience();
      next[expIndex] = { ...current, points: [...current.points, ""] };
      return { ...prev, experience: next };
    });
  };

  const removeExperiencePoint = (expIndex: number, pointIndex: number) => {
    setForm((prev) => {
      const next = [...prev.experience];
      const current = next[expIndex] ?? emptyExperience();
      next[expIndex] = {
        ...current,
        points: current.points.filter((_, i) => i !== pointIndex),
      };
      return { ...prev, experience: next };
    });
  };

  const addExperience = () => setForm((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }));
  const removeExperience = (index: number) => {
    setForm((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const updateProject = (index: number, field: "name" | "description" | "tech", value: string) => {
    setForm((prev) => {
      const next = [...prev.projects];
      const current = next[index] ?? emptyProject();
      if (field === "name") next[index] = { ...current, name: value };
      if (field === "description") next[index] = { ...current, description: value };
      if (field === "tech") next[index] = { ...current, tech: value };
      return { ...prev, projects: next };
    });
  };

  const addProject = () => setForm((prev) => ({ ...prev, projects: [...prev.projects, emptyProject()] }));
  const removeProject = (index: number) => {
    setForm((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const skillsStr = form.skills.join(", ");
  const setSkillsStr = (s: string) =>
    update(
      "skills",
      s.split(",").map((x) => x.trim())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          You need a student profile to edit resume data. Please complete your profile first.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-500">
          Edit the data used to generate your resume. Name, email, and other basic details come from your profile.
        </p>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </Button>
      </div>
      {saved && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-800">
          Resume data saved successfully.
        </div>
      )}

      {/* Read-only basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic information</CardTitle>
          <CardDescription>From your profile. Update these in your account or profile settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Full name</label>
            <Input value={form.fullName} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
            <Input type="email" value={form.email} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Phone</label>
            <Input value={form.phone} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Roll number</label>
            <Input value={form.rollNumber} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Branch</label>
            <Input value={form.branch} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Year / Batch</label>
            <Input value={form.year} readOnly className="bg-gray-50" />
          </div>
        </CardContent>
      </Card>

      {/* CGPA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CGPA</CardTitle>
          <CardDescription>Current CGPA or percentage used on your resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <label className="text-xs font-medium text-gray-500 block mb-1">CGPA / Percentage</label>
            <Input
              value={form.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
              placeholder="e.g. 8.5 or 85%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
          <CardDescription>Comma-separated list of skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="text-xs font-medium text-gray-500 block mb-1">Skills</label>
          <textarea
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="React, Node.js, Python, SQL, ..."
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Education</CardTitle>
            <CardDescription>Degree, institution, and year.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.education.map((e, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Entry {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => removeEducation(i)}
                  disabled={form.education.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Degree</label>
                  <Input
                    value={e.degree}
                    onChange={(ev) => updateEducation(i, "degree", ev.target.value)}
                    placeholder="e.g. B.Tech"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Institution</label>
                  <Input
                    value={e.institution}
                    onChange={(ev) => updateEducation(i, "institution", ev.target.value)}
                    placeholder="College / University"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Year</label>
                  <Input
                    value={e.year}
                    onChange={(ev) => updateEducation(i, "year", ev.target.value)}
                    placeholder="e.g. 2021 - 2025"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Experience</CardTitle>
            <CardDescription>Internships and work experience with bullet points.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.experience.map((exp, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Experience {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => removeExperience(i)}
                  disabled={form.experience.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Company</label>
                  <Input
                    value={exp.company}
                    onChange={(ev) => updateExperience(i, "company", ev.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Role / Job title</label>
                  <Input
                    value={exp.role}
                    onChange={(ev) => updateExperience(i, "role", ev.target.value)}
                    placeholder="e.g. SDE Intern"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Duration</label>
                <Input
                  value={exp.duration}
                  onChange={(ev) => updateExperience(i, "duration", ev.target.value)}
                  placeholder="e.g. May 2024 - Jul 2024"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-500">Bullet points</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addExperiencePoint(i)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add point
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.points.map((pt, j) => (
                    <div key={j} className="flex gap-2">
                      <Input
                        value={pt}
                        onChange={(ev) => updateExperiencePoint(i, j, ev.target.value)}
                        placeholder="Achievement or responsibility"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-gray-400 hover:text-red-600"
                        onClick={() => removeExperiencePoint(i, j)}
                        disabled={exp.points.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Projects</CardTitle>
            <CardDescription>Projects with name, description, and technologies.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addProject} className="gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.projects.map((proj, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Project {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => removeProject(i)}
                  disabled={form.projects.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Project name</label>
                <Input
                  value={proj.name}
                  onChange={(ev) => updateProject(i, "name", ev.target.value)}
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Technologies</label>
                <Input
                  value={proj.tech}
                  onChange={(ev) => updateProject(i, "tech", ev.target.value)}
                  placeholder="e.g. Next.js, Prisma, PostgreSQL"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
                <textarea
                  value={proj.description}
                  onChange={(ev) => updateProject(i, "description", ev.target.value)}
                  placeholder="Brief description of the project"
                  rows={2}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
