"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export function AddCompanyDialog() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    tier: "",
    branch: "",
    handler: "",
    facultyCoordinator: "",
    status: "Prospect",
    lastVisit: "",
    lastPlaced: "",
    lastCTC: "",
    website: "",
    location: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("New Company:", form);

    setOpen(false);

    setForm({
      name: "",
      industry: "",
      tier: "",
      branch: "",
      handler: "",
      facultyCoordinator: "",
      status: "Prospect",
      lastVisit: "",
      lastPlaced: "",
      lastCTC: "",
      website: "",
      location: "",
      notes: "",
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Create Company</h2>

              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Industry"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <select name="tier" value={form.tier} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Select Tier</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>

              <input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Branch"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="handler"
                value={form.handler}
                onChange={handleChange}
                placeholder="Handler"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="facultyCoordinator"
                value={form.facultyCoordinator}
                onChange={handleChange}
                placeholder="Faculty Coordinator"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <select name="status" value={form.status} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="Prospect">Prospect</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
              </select>

              <input
                name="lastPlaced"
                value={form.lastPlaced}
                onChange={handleChange}
                placeholder="Last Year Placed Students"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="lastPackage"
                value={form.lastCTC}
                onChange={handleChange}
                placeholder="Last Year CTC"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="lastVisit"
                value={form.lastVisit}
                onChange={handleChange}
                placeholder="Last Visit Year"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm col-span-2"
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm col-span-2"
              />

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm col-span-2"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
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
