"use client";

import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/components/dialog";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@repo/ui/components/select";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  spaceName: string | null;
  integrationName: string;
  itemLabel?: string;
};

export default function ConfigureSpaceDialog({ open, onOpenChange, spaceName, integrationName, itemLabel = "Channel" }: Props) {
  const [batchYear, setBatchYear] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [webhook, setWebhook] = useState("");

  const completion = useMemo(() => {
    const fields = [department.trim(), branch.trim(), batchYear.trim(), webhook.trim()];
    const completed = fields.filter(Boolean).length;

    return {
      completed,
      total: fields.length,
      isComplete: completed === fields.length,
    };
  }, [department, branch, batchYear, webhook]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConnect = () => {
    if (!completion.isComplete) {
      return;
    }

    console.log({ batchYear, branch, department, webhook, spaceName });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
  sm:max-w-[700px]
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=open]:fade-in-0
  data-[state=closed]:fade-out-0
  data-[state=open]:zoom-in-95
  data-[state=closed]:zoom-out-95
  data-[state=open]:slide-in-from-right-8
  duration-200
"
      >
        <DialogHeader>
          <DialogTitle>
            Configure {integrationName} {itemLabel}
            {spaceName && ` - ${spaceName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border bg-slate-50/70 p-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white px-2 py-1 font-medium text-slate-700">
              Completed: {completion.completed}/{completion.total}
            </span>

            <span className={`rounded-full px-2 py-1 font-medium ${completion.isComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {completion.isComplete ? "Ready to connect" : "Pending required fields"}
            </span>

            {spaceName && <span className="ml-auto truncate rounded-full bg-gray-200 px-2 py-1 font-medium text-gray-700">{spaceName}</span>}
          </div>
        </div>

        <div className="max-h-[52vh] space-y-5 overflow-y-auto py-2 pr-1">
          <section className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-slate-800">Target Scope</h3>
            <p className="mt-1 text-xs text-slate-500">Choose who should receive notifications from this channel.</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input placeholder="Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Batch Year</label>
                <Select value={batchYear} onValueChange={setBatchYear}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select batch year" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-slate-800">Connection</h3>
            <p className="mt-1 text-xs text-slate-500">
              Use the incoming webhook URL generated for this {integrationName} {itemLabel.toLowerCase()}.
            </p>

            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input placeholder="https://chat.googleapis.com/..." value={webhook} onChange={(e) => setWebhook(e.target.value)} className="bg-white" />
            </div>
          </section>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button onClick={handleConnect} disabled={!completion.isComplete}>
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
