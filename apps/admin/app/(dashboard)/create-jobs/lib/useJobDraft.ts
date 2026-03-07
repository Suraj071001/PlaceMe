"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JobDraft } from "./jobDraft";
import { clearJobDraft, loadJobDraft, saveJobDraft } from "./jobDraft";

type Updater = (prev: JobDraft) => JobDraft;

export function useJobDraft() {
  const [draft, setDraft] = useState<JobDraft>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadJobDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJobDraft(draft);
  }, [draft, hydrated]);

  const update = useCallback((next: JobDraft | Updater) => {
    setDraft((prev) => (typeof next === "function" ? (next as Updater)(prev) : next));
  }, []);

  const patch = useCallback((partial: Partial<JobDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    clearJobDraft();
    setDraft({});
  }, []);

  const isPublishable = useMemo(() => {
    // Mirrors required fields from CreateJobSchema (backend)
    return Boolean(draft.companyId && draft.title && draft.role && draft.workMode && draft.closeAt);
  }, [draft.companyId, draft.title, draft.role, draft.workMode, draft.closeAt]);

  return { draft, update, patch, reset, hydrated, isPublishable };
}

