"use client";

import { useState } from "react";
import { SectionTitle, Label, InputField, SelectField, SearchableSelectField, MultiSelectChips } from "./FormElements";

const companyOptions = [
  "Accenture",
  "Amazon",
  "Capgemini",
  "Cisco",
  "Cognizant",
  "Deloitte",
  "Google",
  "IBM",
  "Infosys",
  "Microsoft",
  "Oracle",
  "TCS",
  "Tech Mahindra",
  "Wipro",
].sort((a, b) => a.localeCompare(b));

/* ─── Main ─── */
export function JobDetailsTab() {
  const [companyName, setCompanyName] = useState(companyOptions[0] || "");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [workMode, setWorkMode] = useState("On-Site");
  const [ctcStipend, setCtcStipend] = useState("");
  const [eligibleDepts, setEligibleDepts] = useState<string[]>([]);
  const [minCGPA, setMinCGPA] = useState("");
  const [passingYear, setPassingYear] = useState("2026");
  const [deadline, setDeadline] = useState("");
  const [companyTier, setCompanyTier] = useState("Basic");

  const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 };

  const allDepartments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "MBA", "MCA"];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px clamp(14px, 3vw, 36px)" }}>
      <SectionTitle>Basic Information</SectionTitle>

      {/* Company Name */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Company Name</Label>
        <SearchableSelectField value={companyName} onChange={setCompanyName} options={companyOptions} />
      </div>

      {/* Job Title */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Job Title</Label>
        <InputField placeholder="e.g., Software Developer, Data Analyst" value={jobTitle} onChange={setJobTitle} />
      </div>

      {/* Job Type + Location */}
      <div style={row}>
        <div>
          <Label required>Job Type</Label>
          <SelectField value={jobType} onChange={setJobType} options={["Full-Time", "Internship", "Part-Time", "Contract", "Freelance"]} />
        </div>
        {/* Company Tier */}
        <div style={{ marginBottom: 20 }}>
          <Label required>Company Tier</Label>
          <SelectField value={companyTier} onChange={setCompanyTier} options={["Basic", "Standard", "Dream"]} />
        </div>
      </div>

      {/* Work Mode + Openings */}
      <div style={row}>
        <div>
          <Label required>Work Mode</Label>
          <SelectField value={workMode} onChange={setWorkMode} options={["On-Site", "Remote", "Hybrid"]} />
        </div>
        <div>
          <Label required>CTC / Stipend</Label>
          <InputField placeholder="e.g., ₹6 LPA or ₹25,000/month" value={ctcStipend} onChange={setCtcStipend} />
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "28px 0" }} />

      {/* Eligible Departments */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Eligible Departments</Label>
        <MultiSelectChips options={allDepartments} selected={eligibleDepts} onChange={setEligibleDepts} />
      </div>

      {/* Min CGPA + Passing Year */}
      <div style={row}>
        <div>
          <Label>Minimum CGPA</Label>
          <InputField placeholder="e.g., 6.5" value={minCGPA} onChange={setMinCGPA} />
        </div>
        <div>
          <Label required>Passing Year</Label>
          <SelectField value={passingYear} onChange={setPassingYear} options={["2024", "2025", "2026", "2027", "2028"]} />
        </div>
      </div>

      {/* Application Deadline */}
      <div style={{ marginBottom: 4 }}>
        <Label required>Application Deadline</Label>
        <InputField placeholder="" value={deadline} onChange={setDeadline} type="date" />
      </div>
    </div>
  );
}
