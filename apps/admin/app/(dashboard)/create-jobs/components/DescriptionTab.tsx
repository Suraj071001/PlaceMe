"use client";

import { useState } from "react";
import { Paperclip, X } from "lucide-react";

/* ─── helpers ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1e40af", margin: "0 0 12px" }}>{children}</h2>;
}

function TextArea({ placeholder, value, onChange, rows = 4 }: { placeholder: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        fontSize: 13,
        lineHeight: 1.6,
        color: "#0f172a",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
      }}
    />
  );
}

function BulletList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div>
      {items.length > 0 && (
        <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 13,
                color: "#334155",
                marginBottom: 4,
                lineHeight: 1.7,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span style={{ flex: 1 }}>{item}</span>
              <button
                onClick={() => remove(i)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, padding: 0, flexShrink: 0 }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          style={{ flex: 1, padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, outline: "none" }}
        />
        <button
          onClick={add}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: 7,
            background: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            color: "#1e293b",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export function DescriptionTab() {
  const [aboutCompany, setAboutCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [selectionProcess, setSelectionProcess] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const sectionGap: React.CSSProperties = { marginBottom: 32 };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "32px 36px" }}>
      {/* About Company */}
      <div style={sectionGap}>
        <SectionTitle>About Company</SectionTitle>
        <TextArea placeholder="Write a brief overview about the company..." value={aboutCompany} onChange={setAboutCompany} rows={4} />
      </div>

      {/* Job Description */}
      <div style={sectionGap}>
        <SectionTitle>Job Description</SectionTitle>
        <TextArea placeholder="Describe the role, day-to-day tasks, and expectations..." value={jobDescription} onChange={setJobDescription} rows={5} />
      </div>

      {/* Responsibilities */}
      <div style={sectionGap}>
        <SectionTitle>Responsibilities</SectionTitle>
        <BulletList items={responsibilities} onChange={setResponsibilities} placeholder="Add a responsibility..." />
      </div>

      {/* Required Skills */}
      <div style={sectionGap}>
        <SectionTitle>Required Skills</SectionTitle>
        <BulletList items={requiredSkills} onChange={setRequiredSkills} placeholder="Add a required skill..." />
      </div>

      {/* Preferred Skills */}
      <div style={sectionGap}>
        <SectionTitle>Preferred Skills</SectionTitle>
        <BulletList items={preferredSkills} onChange={setPreferredSkills} placeholder="Add a preferred skill..." />
      </div>

      {/* Selection Process */}
      <div style={sectionGap}>
        <SectionTitle>Selection Process</SectionTitle>
        <BulletList items={selectionProcess} onChange={setSelectionProcess} placeholder="e.g., Online Test → Technical Interview → HR Round" />
      </div>

      {/* Benefits */}
      <div style={sectionGap}>
        <SectionTitle>Benefits</SectionTitle>
        <BulletList items={benefits} onChange={setBenefits} placeholder="Add a benefit or perk..." />
      </div>

      {/* Attachments */}
      <div>
        <SectionTitle>Attachments</SectionTitle>
        <p style={{ fontSize: 12, color: "#64748b", margin: "-4px 0 12px" }}>Upload JD documents, company brochures, or any relevant files.</p>

        {attachments.length > 0 && (
          <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {attachments.map((file, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Paperclip size={14} style={{ color: "#64748b" }} />
                  <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{file.name}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>({file.size})</span>
                </div>
                <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            border: "1.5px dashed #cbd5e1",
            borderRadius: 8,
            background: "#f8fafc",
            color: "#475569",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          <Paperclip size={15} />
          Choose Files
          <input type="file" multiple onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  );
}
