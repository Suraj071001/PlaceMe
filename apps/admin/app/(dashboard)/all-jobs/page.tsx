"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { jobs } from "../../components/data";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 5;

export default function AllJobsPage() {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [department, setDepartment] = useState("All");
  const [tier, setTier] = useState("All");
  const [workMode, setWorkMode] = useState("All");

  const [page, setPage] = useState(1);

  const router = useRouter();

  const filteredJobs = jobs.filter((job) => {
    return (
      (status === "All" || job.status === status) &&
      (type === "All" || job.type === type) &&
      (department === "All" || job.branch.includes(department)) &&
      (tier === "All" || job.tier === tier) &&
      (workMode === "All" || job.workMode === workMode)
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = filteredJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-7">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-semibold">Placement Drives</h1>
          <p className="text-sm text-slate-500">Manage internship and placement opportunities</p>
        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer"
          onClick={() => router.push("/create-jobs")}
        >
          <Plus size={16} />
          Create Job Posting
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm">
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Draft">Draft</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm">
          <option value="All">Type</option>
          <option value="Placement">Placement</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="All">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="Mechanical">Mechanical</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>

        <select value={tier} onChange={(e) => setTier(e.target.value)} className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm">
          <option value="All">Tier</option>
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Dream">Dream</option>
        </select>

        <select
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="All">Work Mode</option>
          <option value="Remote">Remote</option>
          <option value="On-Site">On-Site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button
          onClick={() => {
            setStatus("All");
            setType("All");
            setDepartment("All");
            setTier("All");
            setWorkMode("All");
          }}
          className="flex items-center gap-1 border border-slate-200 px-3 py-2 rounded-md text-sm bg-white shadow-sm hover:bg-slate-50"
        >
          <Filter size={14} />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-600">
              <th className="px-5 py-3 text-center font-semibold">Company</th>
              <th className="px-5 py-3 text-center font-semibold">Role</th>
              <th className="px-5 py-3 text-center font-semibold">Eligible Branch</th>
              <th className="px-5 py-3 text-center font-semibold">Package</th>
              <th className="px-5 py-3 text-center font-semibold">Applicants</th>
              <th className="px-5 py-3 text-center font-semibold">Deadline</th>
              <th className="px-5 py-3 text-center font-semibold">Status</th>
              <th className="px-5 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedJobs.map((job, i) => (
              <tr key={i} className="border-t hover:bg-slate-50 text-center">
                <td className="px-5 py-4 font-medium">{job.company}</td>
                <td className="px-5 py-4">{job.role}</td>
                <td className="px-5 py-4">{job.branch}</td>
                <td className="px-5 py-4">{job.package}</td>

                <td className="px-5 py-4 flex flex-col items-center justify-center">
                  {job.applicants}
                  <div className="h-[4px] w-[60%] bg-slate-200 rounded-full mt-2">
                    <div className="h-full w-[55%] bg-slate-900 rounded-full"></div>
                  </div>
                </td>

                <td className="px-5 py-4">{job.deadline}</td>

                <td className="px-5 py-4">
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">{job.status}</span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100">View</button>

                    <button
                      className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100"
                      onClick={() => router.push("/candidates-pipeline")}
                    >
                      Applicants
                    </button>

                    <button className="border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100">Close</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
        <span>
          Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
        </span>

        <div className="flex gap-2 items-center">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded-md disabled:opacity-40 bg-slate-300 text-black">
            Prev
          </button>

          <span className="px-2">Page {page}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border px-3 py-1 rounded-md disabled:opacity-40 bg-slate-300 text-black"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
