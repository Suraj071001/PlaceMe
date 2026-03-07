"use client";

import { useState, useEffect } from "react";
import { SectionTitle, Label, InputField, SelectField, SearchableSelectField, MultiSelectChips } from "./FormElements";
import { useJobDraft } from "../lib/useJobDraft";

/* ─── Main ─── */
export function JobDetailsTab() {
  const { draft, patch } = useJobDraft();

  const [companyOptions, setCompanyOptions] = useState<{ id: string; name: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{ id: string; name: string }[]>([]);

  // Ensure backend-required fields have sensible defaults in the shared draft
  useEffect(() => {
    const updates: Record<string, unknown> = {};
    if (!draft.workMode) updates.workMode = "On-Site";
    if (!draft.employmentType) updates.employmentType = "FULL_TIME";
    if (!draft.tier) updates.tier = "BASIC";

    if (Object.keys(updates).length > 0) {
      patch(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyName = draft.companyName ?? "";
  const jobTitle = draft.title ?? "";
  const jobType = draft.employmentType ?? "FULL_TIME";
  const workMode = draft.workMode ?? "On-Site";
  const ctcStipend = draft.ctc ?? "";
  const eligibleDepts = draft.departmentNames ?? [];
  const minCGPA = draft.minimumCGPA != null ? String(draft.minimumCGPA) : "";
  const passingYear = draft.passingYear != null ? String(draft.passingYear) : "2026";
  const deadline = draft.closeAt ? draft.closeAt.slice(0, 10) : "";
  const companyTier = draft.tier ?? "BASIC";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5501/api/v1/company", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.data) {
          const items = (json.data as { id: string; name: string }[])
            .filter((c) => c?.id && c?.name)
            .sort((a, b) => a.name.localeCompare(b.name));
          setCompanyOptions(items);

          // Initialize selection if draft is empty
          if (!draft.companyId && items.length > 0) {
            patch({ companyId: items[0]!.id, companyName: items[0]!.name });
          }
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, [draft.companyId, patch]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!draft.companyId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5501/api/v1/department?companyId=${draft.companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.data) {
          const items = (json.data as { id: string; name: string }[])
            .filter((d) => d?.id && d?.name)
            .sort((a, b) => a.name.localeCompare(b.name));
          setDepartmentOptions(items);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, [draft.companyId]);

  const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 };

  const allDepartments = departmentOptions.length > 0 ? departmentOptions.map((d) => d.name) : ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology", "MBA", "MCA"];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px clamp(14px, 3vw, 36px)" }}>
      <SectionTitle>Basic Information</SectionTitle>

      {/* Company Name */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Company Name</Label>
        <SearchableSelectField
          value={companyName}
          onChange={(name) => {
            const selected = companyOptions.find((c) => c.name === name);
            patch({ companyId: selected?.id, companyName: name, departmentId: undefined, departmentNames: [] });
          }}
          options={companyOptions.map((c) => c.name)}
        />
      </div>

      {/* Job Title */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Job Title</Label>
        <InputField
          placeholder="e.g., Software Developer, Data Analyst"
          value={jobTitle}
          onChange={(v) => patch({ title: v, role: v })}
        />
      </div>

      {/* Job Type + Location */}
      <div style={row}>
        <div>
          <Label required>Job Type</Label>
          <SelectField
            value={
              jobType === "FULL_TIME"
                ? "Full-Time"
                : jobType === "INTERNSHIP"
                  ? "Internship"
                  : jobType === "PART_TIME"
                    ? "Part-Time"
                    : jobType === "CONTRACT"
                      ? "Contract"
                      : "Temporary"
            }
            onChange={(v) => {
              const mapped =
                v === "Full-Time"
                  ? "FULL_TIME"
                  : v === "Internship"
                    ? "INTERNSHIP"
                    : v === "Part-Time"
                      ? "PART_TIME"
                      : v === "Contract" || v === "Freelance"
                        ? "CONTRACT"
                        : "TEMPORARY";
              patch({ employmentType: mapped });
            }}
            options={["Full-Time", "Internship", "Part-Time", "Contract", "Temporary"]}
          />
        </div>
        {/* Company Tier */}
        <div style={{ marginBottom: 20 }}>
          <Label required>Company Tier</Label>
          <SelectField
            value={companyTier === "BASIC" ? "Basic" : companyTier === "STANDARD" ? "Standard" : "Dream"}
            onChange={(v) => patch({ tier: v === "Basic" ? "BASIC" : v === "Standard" ? "STANDARD" : "DREAM" })}
            options={["Basic", "Standard", "Dream"]}
          />
        </div>
      </div>

      {/* Work Mode + Openings */}
      <div style={row}>
        <div>
          <Label required>Work Mode</Label>
          <SelectField value={workMode} onChange={(v) => patch({ workMode: v })} options={["On-Site", "Remote", "Hybrid"]} />
        </div>
        <div>
          <Label required>CTC / Stipend</Label>
          <InputField placeholder="e.g., ₹6 LPA or ₹25,000/month" value={ctcStipend} onChange={(v) => patch({ ctc: v })} />
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "28px 0" }} />

      {/* Eligible Departments */}
      <div style={{ marginBottom: 20 }}>
        <Label required>Eligible Departments</Label>
        <MultiSelectChips
          options={allDepartments}
          selected={eligibleDepts}
          onChange={(names) => {
            const nameToId = new Map(departmentOptions.map((d) => [d.name, d.id]));
            patch({
              departmentNames: names,
              departmentId: names.length === 1 ? nameToId.get(names[0]!) : undefined,
            });
          }}
        />
      </div>

      {/* Min CGPA + Passing Year */}
      <div style={row}>
        <div>
          <Label>Minimum CGPA</Label>
          <InputField
            placeholder="e.g., 6.5"
            value={minCGPA}
            onChange={(v) => patch({ minimumCGPA: v.trim() ? Number(v) : undefined })}
          />
        </div>
        <div>
          <Label required>Passing Year</Label>
          <SelectField
            value={passingYear}
            onChange={(v) => patch({ passingYear: Number(v) })}
            options={["2024", "2025", "2026", "2027", "2028"]}
          />
        </div>
      </div>

      {/* Application Deadline */}
      <div style={{ marginBottom: 4 }}>
        <Label required>Application Deadline</Label>
        <InputField
          placeholder=""
          value={deadline}
          onChange={(v) => {
            // store as ISO string (midnight local) for backend z.coerce.date
            patch({
              closeAt: v ? new Date(v).toISOString() : undefined,
              applicationDeadline: v ? new Date(v).toISOString() : undefined,
            });
          }}
          type="date"
        />
      </div>
    </div>
  );
}
