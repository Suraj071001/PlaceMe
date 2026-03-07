"use client";

import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useJobDraft } from "../lib/useJobDraft";

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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input
          type="text"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          style={{ flex: 1, minWidth: 180, padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, outline: "none" }}
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
  const { draft, patch } = useJobDraft();

  const aboutCompany = (draft.additionalDetails?.aboutCompany as string | undefined) ?? "";
  const jobDescription = draft.description ?? "";
  const responsibilities = (draft.additionalDetails?.responsibilities as string[] | undefined) ?? [];
  const requiredSkills = (draft.additionalDetails?.requiredSkills as string[] | undefined) ?? [];
  const preferredSkills = (draft.additionalDetails?.preferredSkills as string[] | undefined) ?? [];
  const selectionProcess = (draft.additionalDetails?.selectionProcess as string[] | undefined) ?? [];
  const benefits = (draft.additionalDetails?.benefits as string[] | undefined) ?? [];

  const updateDetails = (next: Record<string, unknown>) => {
    patch({ additionalDetails: { ...(draft.additionalDetails ?? {}), ...next } });
  };

  const sectionGap: React.CSSProperties = { marginBottom: 32 };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px clamp(14px, 3vw, 36px)" }}>
      {/* About Company */}
      <div style={sectionGap}>
        <SectionTitle>About Company</SectionTitle>
        <TextArea
          placeholder="Write a brief overview about the company..."
          value={aboutCompany}
          onChange={(v) => updateDetails({ aboutCompany: v })}
          rows={4}
        />
      </div>

      {/* Job Description */}
      <div style={sectionGap}>
        <SectionTitle>Job Description</SectionTitle>
        <TextArea
          placeholder="Describe the role, day-to-day tasks, and expectations..."
          value={jobDescription}
          onChange={(v) => patch({ description: v })}
          rows={5}
        />
      </div>

      {/* Responsibilities */}
      <div style={sectionGap}>
        <SectionTitle>Responsibilities</SectionTitle>
        <BulletList items={responsibilities} onChange={(items) => updateDetails({ responsibilities: items })} placeholder="Add a responsibility..." />
      </div>

      {/* Required Skills */}
      <div style={sectionGap}>
        <SectionTitle>Required Skills</SectionTitle>
        <BulletList items={requiredSkills} onChange={(items) => updateDetails({ requiredSkills: items })} placeholder="Add a required skill..." />
      </div>

      {/* Preferred Skills */}
      <div style={sectionGap}>
        <SectionTitle>Preferred Skills</SectionTitle>
        <BulletList items={preferredSkills} onChange={(items) => updateDetails({ preferredSkills: items })} placeholder="Add a preferred skill..." />
      </div>

      {/* Selection Process */}
      <div style={sectionGap}>
        <SectionTitle>Selection Process</SectionTitle>
        <BulletList items={selectionProcess} onChange={(items) => updateDetails({ selectionProcess: items })} placeholder="e.g., Online Test → Technical Interview → HR Round" />
      </div>

      {/* Benefits */}
      <div style={sectionGap}>
        <SectionTitle>Benefits</SectionTitle>
        <BulletList items={benefits} onChange={(items) => updateDetails({ benefits: items })} placeholder="Add a benefit or perk..." />
      </div>
    </div>
  );
}
