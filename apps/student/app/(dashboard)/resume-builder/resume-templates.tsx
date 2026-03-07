"use client";

import Image from "next/image";
import { Globe, Target } from "lucide-react";
import type { StudentResumeProfile } from "./resume-data";

const NIT_AGARTALA_LOGO = "https://www.nita.ac.in/images/logo.png";

const sectionTitle = "text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1 mb-2";

function NitaLogo() {
  return (
    <div className="flex justify-center mb-3">
      <Image
        src={NIT_AGARTALA_LOGO}
        alt="National Institute of Technology Agartala"
        width={120}
        height={56}
        className="h-14 w-auto object-contain"
      />
    </div>
  );
}

function NitaLogoLeft() {
  return (
    <Image
      src={NIT_AGARTALA_LOGO}
      alt="National Institute of Technology Agartala"
      width={64}
      height={64}
      className="h-16 w-auto object-contain"
    />
  );
}

export function ResumeTemplateModern({ profile }: { profile: StudentResumeProfile }) {
  return (
    <div className="bg-white text-gray-800 text-sm font-sans max-w-[210mm] mx-auto shadow-lg">
      <header className="bg-slate-800 text-white px-6 py-4">
        <NitaLogo />
        <h1 className="text-2xl font-bold">{profile.fullName}</h1>
        <p className="text-slate-200 text-sm mt-1">{profile.email} · {profile.phone}</p>
        <p className="text-slate-300 text-xs mt-0.5">{profile.branch} · {profile.year} · CGPA {profile.cgpa} · {profile.rollNumber}</p>
      </header>
      <div className="px-6 py-4 space-y-4">
        <section>
          <h2 className={sectionTitle}>Skills</h2>
          <p className="text-gray-700">{profile.skills.join(" · ")}</p>
        </section>
        <section>
          <h2 className={sectionTitle}>Education</h2>
          {profile.education.map((e, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <span className="font-medium">{e.degree}, {e.institution}</span>
              <span className="text-gray-500 text-xs">{e.year}</span>
            </div>
          ))}
        </section>
        <section>
          <h2 className={sectionTitle}>Experience</h2>
          {profile.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{exp.role} at {exp.company}</span>
                <span className="text-gray-500 text-xs">{exp.duration}</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                {exp.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2 className={sectionTitle}>Projects</h2>
          {profile.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <span className="font-medium">{proj.name}</span>
              <span className="text-gray-500 text-xs"> — {proj.tech}</span>
              <p className="text-gray-600 mt-0.5">{proj.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export function ResumeTemplateClassic({ profile }: { profile: StudentResumeProfile }) {
  return (
    <div className="bg-white text-gray-800 text-sm max-w-[210mm] mx-auto border border-gray-200 p-8 font-serif">
      <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
        <NitaLogo />
        <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
        <p className="text-gray-600 mt-1">{profile.email} | {profile.phone}</p>
        <p className="text-gray-500 text-xs mt-1">{profile.branch} · Year {profile.year} · CGPA {profile.cgpa} · Roll No. {profile.rollNumber}</p>
      </div>
      <section className="mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Skills</h2>
        <p className="text-gray-700">{profile.skills.join(", ")}</p>
      </section>
      <section className="mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Education</h2>
        {profile.education.map((e, i) => (
          <p key={i} className="text-gray-700">{e.degree}, {e.institution} ({e.year})</p>
        ))}
      </section>
      <section className="mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Experience</h2>
        {profile.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <p className="font-semibold text-gray-800">{exp.role}, {exp.company} — {exp.duration}</p>
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {exp.points.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Projects</h2>
        {profile.projects.map((proj, i) => (
          <div key={i} className="mb-2">
            <p className="font-semibold text-gray-800">{proj.name} ({proj.tech})</p>
            <p className="text-gray-600">{proj.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export function ResumeTemplateMinimal({ profile }: { profile: StudentResumeProfile }) {
  return (
    <div className="bg-white text-gray-800 max-w-[210mm] mx-auto p-10 text-sm space-y-8">
      <div>
        <NitaLogo />
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">{profile.fullName}</h1>
        <p className="text-gray-500 mt-2 text-xs">{profile.email}</p>
        <p className="text-gray-500 text-xs">{profile.phone}</p>
        <p className="text-gray-400 text-xs mt-1">{profile.branch} · {profile.year} · CGPA {profile.cgpa}</p>
      </div>
      <div>
        <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Skills</h2>
        <p className="text-gray-600 leading-relaxed">{profile.skills.join(" · ")}</p>
      </div>
      <div>
        <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Education</h2>
        {profile.education.map((e, i) => (
          <p key={i} className="text-gray-600">{e.degree}, {e.institution} — {e.year}</p>
        ))}
      </div>
      <div>
        <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Experience</h2>
        {profile.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <p className="text-gray-900 font-medium">{exp.role}, {exp.company}</p>
            <p className="text-gray-400 text-xs">{exp.duration}</p>
            <ul className="mt-2 text-gray-600 space-y-1">
              {exp.points.map((p, j) => <li key={j} className="pl-4 border-l border-gray-200">{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Projects</h2>
        {profile.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <p className="text-gray-900 font-medium">{proj.name}</p>
            <p className="text-gray-500 text-xs">{proj.tech}</p>
            <p className="text-gray-600 mt-1">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResumeTemplateProfessional({ profile }: { profile: StudentResumeProfile }) {
  return (
    <div className="bg-white text-gray-800 text-sm max-w-[210mm] mx-auto">
      <div className="border-l-4 border-indigo-600 pl-6 py-4 pr-6">
        <NitaLogo />
        <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
        <p className="text-indigo-600 font-medium mt-1">{profile.branch} · Class of {profile.year}</p>
        <p className="text-gray-500 mt-1">{profile.email} · {profile.phone}</p>
        <p className="text-gray-400 text-xs mt-0.5">Roll No. {profile.rollNumber} · CGPA {profile.cgpa}</p>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <section>
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Education</h2>
          {profile.education.map((e, i) => (
            <div key={i} className="flex justify-between">
              <span className="font-medium">{e.degree}, {e.institution}</span>
              <span className="text-gray-500">{e.year}</span>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Experience</h2>
          {profile.experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-indigo-100 pl-3 py-1">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{exp.role}, {exp.company}</span>
                <span className="text-gray-500 text-xs">{exp.duration}</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                {exp.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Projects</h2>
          {profile.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-gray-900">{proj.name}</p>
              <p className="text-gray-500 text-xs">{proj.tech}</p>
              <p className="text-gray-600 mt-0.5">{proj.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const nitSectionTitle = "text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-800 pb-1 mb-2";

export function ResumeTemplateNIT({ profile }: { profile: StudentResumeProfile }) {
  const institution = profile.education[0]?.institution ?? "National Institute of Technology, Agartala";
  return (
    <div className="bg-white text-gray-800 text-sm max-w-[210mm] mx-auto p-8 font-serif">
      {/* Two-column header: logo + details left, contact right */}
      <div className="flex justify-between gap-6 border-b-2 border-gray-800 pb-4 mb-4">
        <div className="flex gap-4">
          <div className="shrink-0">
            <NitaLogoLeft />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{profile.fullName}</h1>
            <p className="text-gray-600 mt-0.5">Bachelor of Technology</p>
            <p className="text-gray-600">{profile.branch}</p>
            <p className="text-gray-600">{institution}</p>
          </div>
        </div>
        <div className="text-right text-gray-700 space-y-0.5">
          <p>{profile.phone}</p>
          <p>{profile.email}</p>
        </div>
      </div>

      {/* EDUCATION - table */}
      <section className="mb-4">
        <h2 className={nitSectionTitle}>Education</h2>
        <table className="w-full border-collapse text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-1.5 font-semibold text-xs uppercase">Degree/Certificate</th>
              <th className="text-left py-1.5 font-semibold text-xs uppercase">Institute/Board</th>
              <th className="text-left py-1.5 font-semibold text-xs uppercase">CGPA/Percentage</th>
              <th className="text-left py-1.5 font-semibold text-xs uppercase">Year</th>
            </tr>
          </thead>
          <tbody>
            {profile.education.map((e, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1.5">{e.degree}</td>
                <td className="py-1.5">{e.institution}</td>
                <td className="py-1.5">{profile.cgpa}</td>
                <td className="py-1.5">{e.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* EXPERIENCE */}
      <section className="mb-4">
        <h2 className={nitSectionTitle}>Experience</h2>
        {profile.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">{exp.company}</span>
                <Globe className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              </div>
              <span className="text-gray-500 text-xs shrink-0">{exp.duration}</span>
            </div>
            <p className="text-gray-700 mt-0.5">{exp.role}</p>
            <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5 ml-0">
              {exp.points.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="mb-4">
        <h2 className={nitSectionTitle}>Projects</h2>
        {profile.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">{proj.name}</span>
                <Target className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-0.5">Tools: {proj.tech}</p>
            <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5 ml-0">
              <li>{proj.description}</li>
            </ul>
          </div>
        ))}
      </section>

      {/* SKILLS */}
      <section>
        <h2 className={nitSectionTitle}>Skills</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-0.5">
          <li><span className="font-semibold">Programming Languages / Technologies:</span> {profile.skills.join(", ")}</li>
        </ul>
      </section>
    </div>
  );
}
