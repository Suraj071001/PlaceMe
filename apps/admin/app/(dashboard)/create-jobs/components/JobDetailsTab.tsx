"use client";

import { useState, useEffect } from "react";
import { SectionTitle, Label, InputField, SelectField, SearchableSelectField, SearchableMultiSelectField } from "./FormElements";
import { useJobDraft } from "../lib/useJobDraft";

const API_BASE_CANDIDATES = [
  process.env.NEXT_PUBLIC_API_V1_URL?.replace(/\/$/, ""),
  "http://localhost:5501/api/v1",
].filter(Boolean) as string[];

async function fetchFromApi(path: string, token: string | null) {
  let lastError: unknown;
  for (const base of API_BASE_CANDIDATES) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        lastError = new Error(`${res.status} ${res.statusText}`);
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().includes("application/json")) {
        const text = await res.text();
        lastError = new Error(
          `Non-JSON response from ${base}${path}: ${text.slice(0, 80)}`,
        );
        continue;
      }

      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("Failed to fetch from API");
}

/* ─── Main ─── */
export function JobDetailsTab() {
  const { draft, patch } = useJobDraft();

  const [companyOptions, setCompanyOptions] = useState<{ id: string; name: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{
    id: string;
    name: string;
    branches: { id: string; name: string; batches: { id: string; name: string }[] }[];
  }[]>([]);

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
  const eligibleBranches = draft.branchNames ?? [];
  const eligibleBatches = draft.batchNames ?? [];
  const minCGPA = draft.minimumCGPA != null ? String(draft.minimumCGPA) : "";
  const passingYear = draft.passingYear != null ? String(draft.passingYear) : "-";
  const deadline = draft.closeAt ? draft.closeAt.slice(0, 10) : "";
  const companyTier = draft.tier ?? "BASIC";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const json = await fetchFromApi("/company", token);
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
      try {
        const token = localStorage.getItem("token");
        const json = await fetchFromApi("/job/eligibility", token);
        if (json?.data) {
          const items = (json.data as {
            id: string;
            name: string;
            branches?: { id: string; name: string; batches?: { id: string; name: string }[] }[];
          }[])
            .filter((d) => d?.id && d?.name)
            .map((d) => ({
              id: d.id,
              name: d.name,
              branches: (d.branches ?? [])
                .filter((b) => b?.id && b?.name)
                .map((b) => ({
                  id: b.id,
                  name: b.name,
                  batches: (b.batches ?? []).filter((batch) => batch?.id && batch?.name),
                })),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setDepartmentOptions(items);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 };

  const branchOptions = departmentOptions
    .filter((d) => eligibleDepts.includes(d.name))
    .flatMap((d) => d.branches)
    .reduce<{ id: string; name: string; batches: { id: string; name: string }[] }[]>((acc, branch) => {
      if (acc.some((b) => b.id === branch.id)) return acc;
      acc.push(branch);
      return acc;
    }, []);
  const batchOptions = branchOptions
    .filter((b) => eligibleBranches.includes(b.name))
    .flatMap((b) => b.batches)
    .reduce<{ id: string; name: string }[]>((acc, batch) => {
      if (acc.some((b) => b.id === batch.id)) return acc;
      acc.push(batch);
      return acc;
    }, []);

  const selectedBatchYears = batchOptions
    .filter((batch) => eligibleBatches.includes(batch.name))
    .flatMap((batch) => {
      const matches = batch.name.match(/\b(19|20)\d{2}\b/g) ?? [];
      return matches.map((m) => Number(m));
    })
    .filter((year, idx, arr) => arr.indexOf(year) === idx)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (selectedBatchYears.length === 0) {
      if (draft.passingYear !== undefined) patch({ passingYear: undefined });
      return;
    }

    // Passing year is derived from selected batch year(s).
    const derivedPassingYear = selectedBatchYears[selectedBatchYears.length - 1];
    if (draft.passingYear !== derivedPassingYear) {
      patch({ passingYear: derivedPassingYear });
    }
  }, [draft.passingYear, patch, selectedBatchYears]);

  const allDepartments = departmentOptions.map((d) => d.name);
  const allBranches = branchOptions.map((b) => b.name);
  const allBatches = batchOptions.map((b) => b.name);

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
            patch({
              companyId: selected?.id,
              companyName: name,
              departmentId: undefined,
              departmentNames: [],
              branchIds: [],
              branchNames: [],
              batchIds: [],
              batchNames: [],
            });
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
        <SearchableMultiSelectField
          options={allDepartments}
          selected={eligibleDepts}
          onChange={(names) => {
            const nameToId = new Map(departmentOptions.map((d) => [d.name, d.id]));
            const nextBranches = departmentOptions
              .filter((d) => names.includes(d.name))
              .flatMap((d) => d.branches)
              .reduce<{ id: string; name: string; batches: { id: string; name: string }[] }[]>((acc, branch) => {
                if (acc.some((b) => b.id === branch.id)) return acc;
                acc.push(branch);
                return acc;
              }, []);
            const filteredBranches = eligibleBranches.filter((name) => nextBranches.some((b) => b.name === name));
            const filteredBranchIds = nextBranches.filter((b) => filteredBranches.includes(b.name)).map((b) => b.id);
            const filteredBatchesPool = nextBranches.flatMap((b) => b.batches);
            const filteredBatchNames = eligibleBatches.filter((name) => filteredBatchesPool.some((b) => b.name === name));
            const filteredBatchIds = filteredBatchesPool.filter((b) => filteredBatchNames.includes(b.name)).map((b) => b.id);
            patch({
              departmentNames: names,
              departmentId: names.length === 1 ? nameToId.get(names[0]!) : undefined,
              branchIds: filteredBranchIds,
              branchNames: filteredBranches,
              batchIds: filteredBatchIds,
              batchNames: filteredBatchNames,
            });
          }}
          placeholder="Select departments"
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <Label required>Reference Branch</Label>
        <SearchableMultiSelectField
          options={allBranches}
          selected={eligibleBranches}
          onChange={(names) => {
            const nameToId = new Map(branchOptions.map((b) => [b.name, b.id]));
            const nextBatchOptions = branchOptions
              .filter((branch) => names.includes(branch.name))
              .flatMap((branch) => branch.batches)
              .reduce<{ id: string; name: string }[]>((acc, batch) => {
                if (acc.some((b) => b.id === batch.id)) return acc;
                acc.push(batch);
                return acc;
              }, []);
            const filteredBatchNames = eligibleBatches.filter((name) =>
              nextBatchOptions.some((batch) => batch.name === name),
            );
            const filteredBatchIds = nextBatchOptions.filter((b) => filteredBatchNames.includes(b.name)).map((b) => b.id);
            patch({
              branchNames: names,
              branchIds: names.map((name) => nameToId.get(name)).filter(Boolean) as string[],
              batchNames: filteredBatchNames,
              batchIds: filteredBatchIds,
            });
          }}
          placeholder={eligibleDepts.length === 0 ? "Select department first" : "Select branches"}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <Label required>Reference Batch</Label>
        <SearchableMultiSelectField
          options={allBatches}
          selected={eligibleBatches}
          onChange={(names) => {
            const nameToId = new Map(batchOptions.map((b) => [b.name, b.id]));
            patch({
              batchNames: names,
              batchIds: names.map((name) => nameToId.get(name)).filter(Boolean) as string[],
            });
          }}
          placeholder={eligibleBranches.length === 0 ? "Select branch first" : "Select batches"}
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
          <div
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: 7,
              fontSize: 13,
              color: "#0f172a",
              background: "#f8fafc",
              minHeight: 39,
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedBatchYears.length > 0 ? selectedBatchYears.join(", ") : passingYear}
          </div>
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
