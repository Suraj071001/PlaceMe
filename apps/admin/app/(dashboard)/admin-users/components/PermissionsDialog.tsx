"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { ShieldCheck, Check } from "lucide-react";

interface PermissionsDialogProps {
  userName: string;
  role: string;
  permissions: Record<string, boolean>;
}

export function PermissionsDialog({ userName, role, permissions }: PermissionsDialogProps) {
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
          {permissionGroups.map((group) => {
            const allowedItems = group.items.filter((item) => permissions[item.id]);
            if (allowedItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allowedItems.map((perm) => (
                    <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="mt-0.5 bg-emerald-100 p-1 rounded-full flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">{perm.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
