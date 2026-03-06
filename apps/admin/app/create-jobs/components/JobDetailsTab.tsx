"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

/* ─── helpers ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1e40af", margin: "0 0 18px" }}>{children}</h2>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );
}

function InputField({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        fontSize: 13,
        color: "#0f172a",
        outline: "none",
        background: "#fff",
      }}
    />
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 34px 10px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 13,
          color: "#0f172a",
          outline: "none",
          background: "#fff",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
    </div>
  );
}

/* ─── Multi-select chip selector ─── */
function MultiSelectChips({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              borderRadius: 20,
              border: isActive ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
              background: isActive ? "#eff6ff" : "#fff",
              color: isActive ? "#1e40af" : "#475569",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {opt}
            {isActive && <X size={12} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main ─── */
export function JobDetailsTab() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("On-Site");
  const [ctcStipend, setCtcStipend] = useState("");
  const [eligibleDepts, setEligibleDepts] = useState<string[]>([]);
  const [minCGPA, setMinCGPA] = useState("");
  const [passingYear, setPassingYear] = useState("2026");
  const [deadline, setDeadline] = useState("");

  const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 };

  const allDepartments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "MBA", "MCA"];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "32px 36px" }}>
      <SectionTitle>Basic Information</SectionTitle>

      {/* Company Name */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Company Name</Label>
        <InputField placeholder="e.g., Google, Infosys, TCS" value={companyName} onChange={setCompanyName} />
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
        <div>
          <Label required>Location</Label>
          <InputField placeholder="e.g., Bangalore, Mumbai, Remote" value={location} onChange={setLocation} />
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
