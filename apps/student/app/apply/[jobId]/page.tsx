"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; label: string; value: string };
type Question = {
  id: string;
  label: string;
  type:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "EMAIL"
    | "PHONE"
    | "YES_NO"
    | "CHECKBOX"
    | "MULTIPLE_CHOICE"
    | "DATE"
    | "FILE_UPLOAD"
    | "URL";
  required?: boolean;
  description?: string | null;
  options?: Option[];
};

type Section = {
  id: string;
  title: string;
  description?: string | null;
  questions: Question[];
};

type Form = {
  id: string;
  title: string;
  sections: Section[];
} | null;

type JobFormResponse = {
  success: boolean;
  data?: {
    job: {
      id: string;
      title?: string;
      role?: string;
      company?: string | null;
      description?: string | null;
      closeAt?: string;
    };
    form: Form;
  };
  message?: string;
};

type JobData = NonNullable<JobFormResponse["data"]>["job"];

const API_BASE = "http://localhost:5501/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ApplyJobPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const jobId = params?.jobId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobData | null>(null);
  const [form, setForm] = useState<Form>(null);

  const [values, setValues] = useState<Record<string, string>>({});
  const [multiValues, setMultiValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadForm = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch(`${API_BASE}/student-application/job/${jobId}/form`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("application/json")) {
          throw new Error("Unexpected server response");
        }

        const body = (await res.json()) as JobFormResponse;
        if (!res.ok || !body?.data) {
          throw new Error(body?.message ?? "Failed to load form");
        }

        setJob(body.data.job);
        setForm(body.data.form ?? null);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load application form");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) loadForm();
  }, [jobId]);

  const allQuestions = useMemo(() => {
    return (form?.sections ?? []).flatMap((s) => s.questions ?? []);
  }, [form]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const missingRequired = allQuestions.find((q) => {
        if (!q.required) return false;
        if (q.type === "CHECKBOX") return (multiValues[q.id] ?? []).length === 0;
        return !(values[q.id] ?? "").trim();
      });

      if (missingRequired) {
        throw new Error(`Please fill required question: ${missingRequired.label}`);
      }

      const applyRes = await fetch(`${API_BASE}/student-application/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const applyBody = await applyRes.json();
      if (!applyRes.ok || !applyBody?.data?.id) {
        throw new Error(applyBody?.message ?? "Failed to create application");
      }

      const applicationId = applyBody.data.id as string;

      if (allQuestions.length > 0) {
        const answers = allQuestions.map((q) => {
          if (q.type === "CHECKBOX") {
            return {
              questionId: q.id,
              values: multiValues[q.id] ?? [],
            };
          }
          return {
            questionId: q.id,
            value: values[q.id] ?? "",
            ...(q.type === "FILE_UPLOAD" ? { fileUrl: values[q.id] ?? "" } : {}),
          };
        });

        const submitRes = await fetch(`${API_BASE}/form-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ applicationId, answers }),
        });

        const submitBody = await submitRes.json();
        if (!submitRes.ok) {
          throw new Error(submitBody?.message ?? "Failed to submit form");
        }
      }

      window.alert("Application submitted successfully.");
      router.push("/jobs");
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (q: Question) => {
    const common = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm";

    if (q.type === "LONG_TEXT") {
      return <textarea className={common} value={values[q.id] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [q.id]: e.target.value }))} rows={4} />;
    }

    if (q.type === "MULTIPLE_CHOICE") {
      return (
        <div className="space-y-2">
          {(q.options ?? []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={q.id}
                value={opt.value}
                checked={(values[q.id] ?? "") === opt.value}
                onChange={(e) => setValues((p) => ({ ...p, [q.id]: e.target.value }))}
              />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (q.type === "CHECKBOX") {
      const selected = multiValues[q.id] ?? [];
      return (
        <div className="space-y-2">
          {(q.options ?? []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={opt.value}
                checked={selected.includes(opt.value)}
                onChange={(e) => {
                  setMultiValues((prev) => {
                    const curr = prev[q.id] ?? [];
                    const next = e.target.checked ? [...curr, opt.value] : curr.filter((v) => v !== opt.value);
                    return { ...prev, [q.id]: next };
                  });
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (q.type === "YES_NO") {
      return (
        <select className={common} value={values[q.id] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [q.id]: e.target.value }))}>
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );
    }

    const htmlType =
      q.type === "EMAIL"
        ? "email"
        : q.type === "PHONE"
          ? "tel"
          : q.type === "DATE"
            ? "date"
            : q.type === "URL" || q.type === "FILE_UPLOAD"
              ? "url"
              : "text";

    return <input className={common} type={htmlType} value={values[q.id] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [q.id]: e.target.value }))} />;
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl p-8 text-slate-700">Loading application form...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50 py-8">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
          <div className="bg-[#7a1d1d] px-6 py-4 text-white">
            <p className="text-xs tracking-[0.18em] uppercase text-amber-200">NIT Agartala</p>
            <p className="text-sm font-medium">Career Development Cell - Job Application Portal</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 sm:flex-row">
            <img
              src="https://www.nita.ac.in/images/logo.png"
              alt="NIT Agartala logo"
              className="h-16 w-16 rounded-full border border-amber-200 bg-white p-1 shadow-sm"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-slate-900">{job?.title ?? "Job Application"}</h1>
              <p className="text-sm text-slate-600 mt-1">{job?.company ?? "Placement Opportunity"}</p>
              {job?.description && <p className="text-sm text-slate-700 mt-3 max-w-2xl">{job.description}</p>}
            </div>
          </div>
        </div>

        {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {form ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{form.title}</h2>

            {form.sections.map((section) => (
              <div key={section.id} className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">{section.title}</h3>
                  {section.description && <p className="text-sm text-slate-600 mt-1">{section.description}</p>}
                </div>

                {section.questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      {q.label} {q.required ? <span className="text-red-600">*</span> : null}
                    </label>
                    {q.description && <p className="text-xs text-slate-500">{q.description}</p>}
                    {renderQuestion(q)}
                  </div>
                ))}
              </div>
            ))}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-md bg-[#7a1d1d] px-4 py-2 text-sm font-medium text-white hover:bg-[#641717] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-700">This job does not require an additional application form.</p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 rounded-md bg-[#7a1d1d] px-4 py-2 text-sm font-medium text-white hover:bg-[#641717] disabled:opacity-60"
            >
              {submitting ? "Applying..." : "Apply Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
