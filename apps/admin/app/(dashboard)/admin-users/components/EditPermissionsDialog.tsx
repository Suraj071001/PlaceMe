"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

interface EditPermissionsDialogProps {
  userName: string;
  role: string;
  allPermissions: { id: string; name: string; description?: string | null }[];
  selectedPermissionIds: string[];
  onSave: (newPermissionIds: string[]) => Promise<void>;
}

export function EditPermissionsDialog({
  userName,
  role,
  allPermissions,
  selectedPermissionIds,
  onSave,
}: EditPermissionsDialogProps) {
  const [localPermIds, setLocalPermIds] = useState<string[]>(selectedPermissionIds);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLocalPermIds(selectedPermissionIds);
    }
  };

  const handleToggle = (id: string) => {
    setLocalPermIds((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localPermIds);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-slate-700 font-medium border-slate-200 shadow-sm hover:bg-slate-50">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0">
        <div className="p-6 border-b border-slate-100 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">Edit Permissions</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Modify access rights for {userName} ({role}).
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 py-4 max-h-[60vh] overflow-y-auto space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allPermissions.map((perm) => (
              <label
                key={perm.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={localPermIds.includes(perm.id)}
                    onChange={() => handleToggle(perm.id)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-800">{perm.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{perm.description || "No description"}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-slate-100 bg-white shrink-0 rounded-b-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 rounded-lg shadow-sm border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
