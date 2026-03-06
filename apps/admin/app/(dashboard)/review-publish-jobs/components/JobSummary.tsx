export default function JobSummary() {
  const job = {
    company: "Amazon",
    role: "SDE Intern",
    type: "Internship",
    location: "Bangalore",
    tier: "Dream",
    package: "₹50k/month",
    openings: 5,
    deadline: "10 Apr 2026",
    departments: "CSE, ECE",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Job Information</h2>

      <div className="grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-slate-500">Company</p>
          <p className="font-medium">{job.company}</p>
        </div>

        <div>
          <p className="text-slate-500">Role</p>
          <p className="font-medium">{job.role}</p>
        </div>

        <div>
          <p className="text-slate-500">Job Type</p>
          <p className="font-medium">{job.type}</p>
        </div>

        <div>
          <p className="text-slate-500">Location</p>
          <p className="font-medium">{job.location}</p>
        </div>

        <div>
          <p className="text-slate-500">Tier</p>
          <p className="font-medium">{job.tier}</p>
        </div>

        <div>
          <p className="text-slate-500">Package</p>
          <p className="font-medium">{job.package}</p>
        </div>

        <div>
          <p className="text-slate-500">Openings</p>
          <p className="font-medium">{job.openings}</p>
        </div>

        <div>
          <p className="text-slate-500">Deadline</p>
          <p className="font-medium">{job.deadline}</p>
        </div>

        <div>
          <p className="text-slate-500">Eligible Departments</p>
          <p className="font-medium">{job.departments}</p>
        </div>
      </div>
    </div>
  );
}
