import PipelineBoard from "./components/PipelineBoard";

export default function PipelinePage() {
  return (
    <div className="flex h-full flex-col gap-6 px-3 pb-4 pt-4 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Placement Pipeline</h1>
        <p className="text-sm text-gray-500">Track students across placement stages</p>
      </div>

      {/* Drive Info */}
      <div className="grid w-full grid-cols-2 gap-3 rounded-xl border bg-white p-4 text-center text-sm sm:grid-cols-4 sm:gap-4">
        <div className="min-w-0">
          <p className="text-gray-500">Company</p>
          <p className="font-medium truncate">Amazon</p>
        </div>

        <div className="min-w-0">
          <p className="text-gray-500">Role</p>
          <p className="font-medium truncate">SDE Intern</p>
        </div>

        <div className="min-w-0">
          <p className="text-gray-500">Package</p>
          <p className="font-medium">₹18 LPA</p>
        </div>

        <div className="min-w-0">
          <p className="text-gray-500">Applicants</p>
          <p className="font-medium">120</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        <PipelineBoard />
      </div>
    </div>
  );
}
