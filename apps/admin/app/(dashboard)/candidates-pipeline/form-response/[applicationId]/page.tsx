"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; label: string; value: string };
type Question = {
  id: string;
  label: string;
  type: string;
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

type ApiResponse = {
  success: boolean;
  data?: {
    id: string;
    status?: string;
    student?: {
      user?: { firstName?: string; lastName?: string; email?: string };
      branch?: { name?: string };
      batch?: { name?: string };
    };
    job?: {
      title?: string;
      role?: string;
      company?: { name?: string };
      applicationForms?: {
        id: string;
        title: string;
        sections: Section[];
      }[];
    };
    formResponse?: {
      id: string;
      answers: {
        questionId: string;
        value?: string | null;
        values?: string[];
        fileUrl?: string | null;
      }[];
    } | null;
  };
  message?: string;
};

const API_BASE = "http://localhost:5501/api/v1";

function answerLabel(question: Question, answer: { value?: string | null; values?: string[]; fileUrl?: string | null }) {
  if (answer.fileUrl) return answer.fileUrl;
  if (question.type === "CHECKBOX") {
    const vals = answer.values ?? [];
    if (vals.length === 0) return "—";
    const optionMap = new Map((question.options ?? []).map((o) => [o.value, o.label]));
    return vals.map((v) => optionMap.get(v) ?? v).join(", ");
  }
  if (question.type === "MULTIPLE_CHOICE") {
    const optionMap = new Map((question.options ?? []).map((o) => [o.value, o.label]));
    const v = answer.value ?? "";
    return (optionMap.get(v) ?? v) || "—";
  }
  return answer.value || "—";
}

export default function AdminFormResponsePage() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const applicationId = params?.applicationId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse["data"]>();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first.");

        const res = await fetch(`${API_BASE}/admin-applications/${applicationId}/form-response`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("application/json")) {
          throw new Error("Unexpected server response");
        }

        const body = (await res.json()) as ApiResponse;
        if (!res.ok || !body?.data) {
          throw new Error(body?.message ?? "Failed to load response");
        }
        setData(body.data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load form response");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) load();
  }, [applicationId]);

  const answerMap = useMemo(() => {
    const map = new Map<string, { value?: string | null; values?: string[]; fileUrl?: string | null }>();
    for (const ans of data?.formResponse?.answers ?? []) {
      map.set(ans.questionId, ans);
    }
    return map;
  }, [data]);

  if (loading) {
    return <div className="mx-auto max-w-5xl p-8">Loading form response...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Application Form Response</h1>
          <p className="text-sm text-slate-600 mt-1">Review submitted answers for this application.</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!error && data && (
        <>
          <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-slate-500">Student</p>
              <p className="text-sm font-medium text-slate-900">
                {data.student?.user?.firstName ?? ""} {data.student?.user?.lastName ?? ""}
              </p>
              <p className="text-xs text-slate-500">{data.student?.user?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Branch / Batch</p>
              <p className="text-sm font-medium text-slate-900">{data.student?.branch?.name ?? "—"}</p>
              <p className="text-xs text-slate-500">{data.student?.batch?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Job</p>
              <p className="text-sm font-medium text-slate-900">{data.job?.role ?? data.job?.title ?? "—"}</p>
              <p className="text-xs text-slate-500">{data.job?.company?.name ?? "—"}</p>
            </div>
          </div>

          {(data.job?.applicationForms?.[0]?.sections ?? []).map((section) => (
            <div key={section.id} className="rounded-xl border bg-white p-5 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                {section.description && <p className="text-sm text-slate-600 mt-1">{section.description}</p>}
              </div>

              <div className="space-y-3">
                {section.questions.map((q) => {
                  const answer = answerMap.get(q.id);
                  return (
                    <div key={q.id} className="rounded-md border border-slate-200 p-3">
                      <p className="text-sm font-medium text-slate-900">{q.label}</p>
                      {q.description && <p className="text-xs text-slate-500 mt-1">{q.description}</p>}
                      <p className="text-sm text-slate-700 mt-2 break-words">
                        {answer ? answerLabel(q, answer) : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
