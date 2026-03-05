"use client";

import { Save, Plus, ArrowLeft } from "lucide-react";
import ActionBtn from "./ActionBtn";
import { useRouter } from "next/navigation";

export default function CreateJobHeader() {
  const router = useRouter();
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 32px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Title Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Create Job Posting
            </h1>

            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                margin: "4px 0 0",
              }}
            >
              Define your role and start receiving applications
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <ActionBtn label="Save Draft" icon={<Save size={15} />} />

          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => router.push("/application-form")}
          >
            <Plus size={15} /> Next Application Form
          </button>
        </div>
      </div>
    </div>
  );
}
