"use client";

import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";

import { Button } from "@repo/ui/components/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAddSpace: () => void;
};

export default function SpacesDialog({ open, onOpenChange, onAddSpace }: Props) {
  const chatSpaces = ["Placement Updates", "Internship Notifications", "Drive Announcements"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Google Chat Spaces</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {chatSpaces.map((space) => (
            <div key={space} className="border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium">{space}</span>

              <Button size="sm" variant="outline" onClick={onAddSpace}>
                Configure
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button className="w-full flex items-center gap-2" onClick={onAddSpace}>
            <Plus size={16} />
            Add Space
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
