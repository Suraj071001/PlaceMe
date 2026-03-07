"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

/* ─── helpers ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1e40af", margin: "0 0 18px" }}>{children}</h2>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: checked ? "#2563eb" : "#cbd5e1",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

/* ─── channel row ─── */
function ChannelRow({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        marginBottom: 12,
        background: enabled ? "#f0f7ff" : "#fff",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 220 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: enabled ? "#dbeafe" : "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: enabled ? "#2563eb" : "#64748b",
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{label}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{description}</div>
        </div>
      </div>
      <Toggle checked={enabled} onChange={onToggle} />
    </div>
  );
}

/* ─── checkbox row ─── */
function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        color: "#334155",
        cursor: "pointer",
        marginBottom: 14,
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 16, height: 16, accentColor: "#2563eb" }} />
      {label}
    </label>
  );
}

/* ─── Main ─── */
export function SettingsTab() {
  /* Distribution channels */
  const [googleChat, setGoogleChat] = useState(false);
  const [email, setEmail] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: "20px clamp(14px, 3vw, 36px)",
      }}
    >
      {/* ── Job Post Distribution ── */}
      <SectionTitle>Job Post Distribution</SectionTitle>
      <p style={{ fontSize: 13, color: "#64748b", margin: "-8px 0 18px" }}>Choose how you want to share this job position with students and recruiters.</p>

      <ChannelRow
        icon={<MessageSquare size={18} />}
        label="Google Chat"
        description="Send job posting to Google Chat spaces and groups"
        enabled={googleChat}
        onToggle={() => setGoogleChat(!googleChat)}
      />

      <ChannelRow
        icon={<Mail size={18} />}
        label="Email"
        description="Notify students and faculty via email notification"
        enabled={email}
        onToggle={() => setEmail(!email)}
      />
    </div>
  );
}
