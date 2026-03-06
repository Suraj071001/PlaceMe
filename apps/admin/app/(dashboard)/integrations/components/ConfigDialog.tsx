"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/components/dialog";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@repo/ui/components/select";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ConfigureSpaceDialog({ open, onOpenChange }: Props) {
  const [batchYear, setBatchYear] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [webhook, setWebhook] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Configure Space</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Input placeholder="Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <Select onValueChange={setBranch}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Batch Year</label>
            <Select onValueChange={setBatchYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch year" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL</label>
            <Input placeholder="https://chat.googleapis.com/..." value={webhook} onChange={(e) => setWebhook(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              console.log({ batchYear, branch, department, webhook });
              onOpenChange(false);
            }}
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
