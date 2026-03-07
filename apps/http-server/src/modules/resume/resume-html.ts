/**
 * Server-side HTML for resume templates. Used by Puppeteer to generate PDF.
 */

const NIT_AGARTALA_LOGO = "https://www.nita.ac.in/images/logo.png";

const logoImgHtml = `<div style="display:flex;justify-content:center;margin-bottom:12px;"><img src="${NIT_AGARTALA_LOGO}" alt="National Institute of Technology Agartala" style="height:56px;width:auto;object-fit:contain;" /></div>`;

export type ResumeProfile = {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    points: string[];
  }[];
  projects: { name: string; description: string; tech: string }[];
};

export type ResumeTemplateId = "modern" | "classic" | "minimal" | "professional";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const sectionTitle =
  "font-semibold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1 mb-2";

function modernHtml(p: ResumeProfile): string {
  const skillsHtml = esc(p.skills.join(" · "));
  const eduHtml = p.education
    .map(
      (e) =>
        `<div class="flex justify-between items-baseline"><span class="font-medium">${esc(e.degree)}, ${esc(e.institution)}</span><span class="text-gray-500 text-xs">${esc(e.year)}</span></div>`
    )
    .join("");
  const expHtml = p.experience
    .map(
      (exp) =>
        `<div class="mb-3">
          <div class="flex justify-between items-baseline"><span class="font-medium">${esc(exp.role)} at ${esc(exp.company)}</span><span class="text-gray-500 text-xs">${esc(exp.duration)}</span></div>
          <ul class="list-disc list-inside text-gray-600 mt-1 space-y-0.5">${exp.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
        </div>`
    )
    .join("");
  const projHtml = p.projects
    .map(
      (proj) =>
        `<div class="mb-2"><span class="font-medium">${esc(proj.name)}</span><span class="text-gray-500 text-xs"> — ${esc(proj.tech)}</span><p class="text-gray-600 mt-0.5">${esc(proj.description)}</p></div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.4; color: #1f2937; margin: 0; }
    .container { max-width: 210mm; margin: 0 auto; }
    header { background: #1e293b; color: #fff; padding: 16px 24px; }
    header h1 { font-size: 24px; font-weight: 700; margin: 0; }
    header p { margin: 4px 0 0; font-size: 14px; color: #e2e8f0; }
    .content { padding: 24px; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
    ul { margin: 4px 0 0; padding-left: 1rem; }
    li { margin: 2px 0; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-baseline { align-items: baseline; }
    .font-medium { font-weight: 500; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-xs { font-size: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mt-1 { margin-top: 4px; }
    .mt-0\\.5 { margin-top: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${logoImgHtml}
      <h1>${esc(p.fullName)}</h1>
      <p>${esc(p.email)} · ${esc(p.phone)}</p>
      <p style="color:#cbd5e1;font-size:12px;">${esc(p.branch)} · ${esc(p.year)} · CGPA ${esc(p.cgpa)} · ${esc(p.rollNumber)}</p>
    </header>
    <div class="content">
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <p class="text-gray-600">${skillsHtml}</p>
      </div>
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${eduHtml}
      </div>
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${expHtml}
      </div>
      <div class="section">
        <h2 class="section-title">Projects</h2>
        ${projHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function classicHtml(p: ResumeProfile): string {
  const skillsHtml = esc(p.skills.join(", "));
  const eduHtml = p.education
    .map((e) => `<p class="text-gray-700">${esc(e.degree)}, ${esc(e.institution)} (${esc(e.year)})</p>`)
    .join("");
  const expHtml = p.experience
    .map(
      (exp) =>
        `<div class="mb-3"><p class="font-semibold text-gray-800">${esc(exp.role)}, ${esc(exp.company)} — ${esc(exp.duration)}</p><ul class="list-disc list-inside text-gray-600 mt-1">${exp.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul></div>`
    )
    .join("");
  const projHtml = p.projects
    .map(
      (proj) =>
        `<div class="mb-2"><p class="font-semibold text-gray-800">${esc(proj.name)} (${esc(proj.tech)})</p><p class="text-gray-600">${esc(proj.description)}</p></div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: Georgia, serif; font-size: 14px; line-height: 1.5; color: #1f2937; margin: 0; padding: 32px; max-width: 210mm; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 12px; margin-bottom: 16px; }
    .header h1 { font-size: 24px; font-weight: 700; margin: 0; }
    .section { margin-bottom: 16px; }
    .section h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    ul { margin: 4px 0 0; padding-left: 1.5rem; }
    .font-semibold { font-weight: 600; }
    .text-gray-700 { color: #374151; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-600 { color: #4b5563; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mt-1 { margin-top: 4px; }
  </style>
</head>
<body>
  <div class="header">
    ${logoImgHtml}
    <h1>${esc(p.fullName)}</h1>
    <p style="margin:4px 0 0;color:#4b5563;">${esc(p.email)} | ${esc(p.phone)}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${esc(p.branch)} · Year ${esc(p.year)} · CGPA ${esc(p.cgpa)} · Roll No. ${esc(p.rollNumber)}</p>
  </div>
  <div class="section"><h2>Skills</h2><p class="text-gray-700">${skillsHtml}</p></div>
  <div class="section"><h2>Education</h2>${eduHtml}</div>
  <div class="section"><h2>Experience</h2>${expHtml}</div>
  <div class="section"><h2>Projects</h2>${projHtml}</div>
</body>
</html>`;
}

function minimalHtml(p: ResumeProfile): string {
  const skillsHtml = esc(p.skills.join(" · "));
  const eduHtml = p.education
    .map((e) => `<p class="text-gray-600">${esc(e.degree)}, ${esc(e.institution)} — ${esc(e.year)}</p>`)
    .join("");
  const expHtml = p.experience
    .map(
      (exp) =>
        `<div class="mb-4"><p class="text-gray-900 font-medium">${esc(exp.role)}, ${esc(exp.company)}</p><p class="text-gray-400 text-xs">${esc(exp.duration)}</p><ul class="mt-2 text-gray-600 space-y-1">${exp.points.map((pt) => `<li class="pl-4 border-l border-gray-200">${esc(pt)}</li>`).join("")}</ul></div>`
    )
    .join("");
  const projHtml = p.projects
    .map(
      (proj) =>
        `<div class="mb-3"><p class="text-gray-900 font-medium">${esc(proj.name)}</p><p class="text-gray-500 text-xs">${esc(proj.tech)}</p><p class="text-gray-600 mt-1">${esc(proj.description)}</p></div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.6; color: #1f2937; margin: 0; padding: 40px; max-width: 210mm; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 300; letter-spacing: -0.02em; margin: 0; }
    .muted { color: #6b7280; font-size: 12px; margin-top: 8px; }
    .section { margin-top: 32px; }
    .section-title { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 12px; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-900 { color: #111827; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-400 { color: #9ca3af; }
    .font-medium { font-weight: 500; }
    .text-xs { font-size: 12px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-1 { margin-top: 4px; }
    .mt-2 { margin-top: 8px; }
    li { margin: 4px 0; padding-left: 16px; border-left: 1px solid #e5e7eb; margin-left: 0; }
  </style>
</head>
<body>
  <div>${logoImgHtml}<h1>${esc(p.fullName)}</h1><p class="muted">${esc(p.email)}</p><p class="muted">${esc(p.phone)}</p><p class="muted">${esc(p.branch)} · ${esc(p.year)} · CGPA ${esc(p.cgpa)}</p></div>
  <div class="section"><h2 class="section-title">Skills</h2><p class="text-gray-600">${skillsHtml}</p></div>
  <div class="section"><h2 class="section-title">Education</h2>${eduHtml}</div>
  <div class="section"><h2 class="section-title">Experience</h2>${expHtml}</div>
  <div class="section"><h2 class="section-title">Projects</h2>${projHtml}</div>
</body>
</html>`;
}

function professionalHtml(p: ResumeProfile): string {
  const skillsHtml = p.skills
    .map((s) => `<span class="tag">${esc(s)}</span>`)
    .join("");
  const eduHtml = p.education
    .map(
      (e) =>
        `<div class="flex justify-between"><span class="font-medium">${esc(e.degree)}, ${esc(e.institution)}</span><span class="text-gray-500">${esc(e.year)}</span></div>`
    )
    .join("");
  const expHtml = p.experience
    .map(
      (exp) =>
        `<div class="exp-block"><div class="flex justify-between items-baseline"><span class="font-semibold">${esc(exp.role)}, ${esc(exp.company)}</span><span class="text-gray-500 text-xs">${esc(exp.duration)}</span></div><ul class="list-disc list-inside text-gray-600 mt-1">${exp.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul></div>`
    )
    .join("");
  const projHtml = p.projects
    .map(
      (proj) =>
        `<div class="mb-2"><p class="font-semibold text-gray-900">${esc(proj.name)}</p><p class="text-gray-500 text-xs">${esc(proj.tech)}</p><p class="text-gray-600 mt-1">${esc(proj.description)}</p></div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.4; color: #1f2937; margin: 0; }
    .container { max-width: 210mm; margin: 0 auto; }
    .header { border-left: 4px solid #4f46e5; padding: 16px 24px 16px 20px; }
    .header h1 { font-size: 24px; font-weight: 700; margin: 0; }
    .accent { color: #4f46e5; font-weight: 500; }
    .content { padding: 24px; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; margin-bottom: 8px; }
    .tag { background: #eef2ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 6px; margin-bottom: 4px; display: inline-block; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-baseline { align-items: baseline; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-900 { color: #111827; }
    .text-xs { font-size: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mt-1 { margin-top: 4px; }
    .exp-block { border-left: 2px solid #e0e7ff; padding-left: 12px; margin-bottom: 8px; }
    ul { margin: 4px 0 0; padding-left: 1rem; }
    li { margin: 2px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoImgHtml}
      <h1>${esc(p.fullName)}</h1>
      <p class="accent" style="margin:4px 0 0;">${esc(p.branch)} · Class of ${esc(p.year)}</p>
      <p style="margin:4px 0 0;color:#6b7280;">${esc(p.email)} · ${esc(p.phone)}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Roll No. ${esc(p.rollNumber)} · CGPA ${esc(p.cgpa)}</p>
    </div>
    <div class="content">
      <div class="section"><h2 class="section-title">Skills</h2><div>${skillsHtml}</div></div>
      <div class="section"><h2 class="section-title">Education</h2>${eduHtml}</div>
      <div class="section"><h2 class="section-title">Experience</h2>${expHtml}</div>
      <div class="section"><h2 class="section-title">Projects</h2>${projHtml}</div>
    </div>
  </div>
</body>
</html>`;
}

const RENDERERS: Record<ResumeTemplateId, (p: ResumeProfile) => string> = {
  modern: modernHtml,
  classic: classicHtml,
  minimal: minimalHtml,
  professional: professionalHtml,
};

export function getResumeHtml(profile: ResumeProfile, templateId: ResumeTemplateId): string {
  const render = RENDERERS[templateId];
  if (!render) throw new Error(`Unknown template: ${templateId}`);
  return render(profile);
}
