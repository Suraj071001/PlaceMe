"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Company } from "./CompanyTable";

type BranchOption = {
  id: string;
  name: string;
};

type NewCompanyPayload = {
  name: string;
  domain: string;
  industry: string;
  facultyCoordinator: string;
  status: Company["status"];
  branchId: string;
};

interface AddCompanyDialogProps {
  onAddCompany: (company: NewCompanyPayload) => void;
  branchOptions: BranchOption[];
}

export function AddCompanyDialog({ onAddCompany, branchOptions }: AddCompanyDialogProps) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    industry: "",
    branchId: "",
    facultyCoordinator: "",
    status: "INTERESTED" as Company["status"],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.branchId) return;

    onAddCompany({
      name: form.name.trim(),
      domain: form.domain.trim(),
      industry: form.industry.trim(),
      branchId: form.branchId,
      facultyCoordinator: form.facultyCoordinator.trim(),
      status: form.status,
    });

    setOpen(false);

    setForm({
      name: "",
      domain: "",
      industry: "",
      branchId: "",
      facultyCoordinator: "",
      status: "INTERESTED",
    });
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Company
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Create Company</h2>

              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="domain"
                value={form.domain}
                onChange={handleChange}
                placeholder="Domain (e.g. www.company.com)"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Industry"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <select name="branchId" value={form.branchId} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Select Branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <input
                name="facultyCoordinator"
                value={form.facultyCoordinator}
                onChange={handleChange}
                placeholder="Faculty Coordinator"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <select name="status" value={form.status} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="CONTACTED">Contacted</option>
                <option value="INTERESTED">Interested</option>
                <option value="NOT_INTERESTED">Not Interested</option>
                <option value="DRIVE_COMPLETED">Drive Completed</option>
                <option value="OFFER_RELEASED">Offer Released</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="BLACKLISTED">Blacklisted</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg">
                Cancel
              </button>

              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Create Company
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
