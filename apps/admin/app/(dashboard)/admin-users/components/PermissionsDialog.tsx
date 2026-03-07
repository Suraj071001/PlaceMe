"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { ShieldCheck, Check } from "lucide-react";

interface PermissionsDialogProps {
  userName: string;
  role: string;
  permissions: { id: string; name: string; description?: string | null }[];
}

export function PermissionsDialog({ userName, role, permissions }: PermissionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-slate-700 font-medium border-slate-200 shadow-sm hover:bg-slate-50">
          Permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0">
        <div className="p-6 border-b border-slate-100 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">Admin Permissions</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Viewing access for {userName} ({role}).
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 py-4 max-h-[60vh] overflow-y-auto space-y-6 bg-white">
          {permissions.length === 0 ? (
            <p className="text-sm text-slate-500">No permissions assigned for this role.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="mt-0.5 bg-emerald-100 p-1 rounded-full flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">{perm.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{perm.description || "No description"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 p-6 border-t border-slate-100 bg-white shrink-0 rounded-b-lg">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-slate-700 rounded-lg shadow-sm border-slate-200 hover:bg-slate-50">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
