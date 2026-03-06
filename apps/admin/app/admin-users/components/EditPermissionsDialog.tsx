"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { ShieldAlert } from "lucide-react";

import { useState } from "react";

interface EditPermissionsDialogProps {
  userName: string;
  role: string;
  permissions: Record<string, boolean>;
  onSave: (newPermissions: Record<string, boolean>) => void;
}

export function EditPermissionsDialog({ userName, role, permissions, onSave }: EditPermissionsDialogProps) {
  const [localPerms, setLocalPerms] = useState<Record<string, boolean>>(permissions);
  const [isOpen, setIsOpen] = useState(false);

  // Sync state when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLocalPerms(permissions);
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    setLocalPerms((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    onSave(localPerms);
    setIsOpen(false);
  };

  const permissionGroups = [
    {
      title: "Director",
      items: [
        { id: "view_global", title: "View Global Dashboard", description: "Access system-wide analytics" },
        { id: "edit_platform", title: "Edit Platform Settings", description: "Configure global application settings" },
        { id: "edit_policies", title: "Manage Placement Policies", description: "Update college level rules" },
        { id: "approve_final", title: "Give Final Approvals", description: "Final sign-off on major actions" },
      ],
    },
    {
      title: "Placement Head",
      items: [
        { id: "view_reports", title: "View Placement Reports", description: "Access placement and drive reports" },
        { id: "edit_schedules", title: "Edit Drive Schedules", description: "Modify company drive dates" },
        { id: "edit_jobs", title: "Edit Company Job Posts", description: "Modify job descriptions and criteria" },
        { id: "manage_fc", title: "Manage Faculty Coordinators", description: "Assign and manage FC roles" },
      ],
    },
    {
      title: "Faculty Coordinator",
      items: [
        { id: "view_dept", title: "View Department Metrics", description: "Access department specific data" },
        { id: "verify_profiles", title: "Verify Student Profiles", description: "Approve student detail edits" },
        { id: "edit_records", title: "Edit Student Records", description: "Modify student academic records" },
        { id: "manage_insights", title: "Manage Dept Insights", description: "Update department level reports" },
      ],
    },
    {
      title: "Internship Coordinator (IC)",
      items: [
        { id: "view_intern_co", title: "View Internship Companies", description: "See list of internship partners" },
        { id: "view_intern_apps", title: "View Internship Apps", description: "See student internship applications" },
        { id: "view_resumes_ic", title: "View Student Resumes", description: "Access student resume documents" },
        { id: "view_interviews_ic", title: "View Interview Schedules", description: "See upcoming interview slots" },
      ],
    },
    {
      title: "Placement Coordinator (PC)",
      items: [
        { id: "view_place_co", title: "View Placement Companies", description: "See list of placement partners" },
        { id: "view_job_posts", title: "View Job Postings", description: "See active job opportunities" },
        { id: "view_place_status", title: "View Placement Status", description: "See student placement progress" },
        { id: "view_results", title: "View Drive Results", description: "See who got selected" },
      ],
    },
  ];

  const getVisibleGroups = (targetRole: string) => {
    if (targetRole === "Director") return ["Director", "Placement Head", "Faculty Coordinator", "Internship Coordinator (IC)", "Placement Coordinator (PC)"];
    if (targetRole === "Placement Head") return ["Placement Head", "Faculty Coordinator", "Internship Coordinator (IC)", "Placement Coordinator (PC)"];
    if (targetRole === "Faculty Coordinator") return ["Faculty Coordinator", "Internship Coordinator (IC)", "Placement Coordinator (PC)"];
    if (targetRole === "IC") return ["Internship Coordinator (IC)"];
    if (targetRole === "PC") return ["Placement Coordinator (PC)"];
    return [];
  };

  const visibleGroupTitles = getVisibleGroups(role);
  const filteredGroups = permissionGroups.filter((g) => visibleGroupTitles.includes(g.title));

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
          {filteredGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">{group.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={localPerms[perm.id] || false}
                        onChange={(e) => handleToggle(perm.id, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-800">{perm.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
