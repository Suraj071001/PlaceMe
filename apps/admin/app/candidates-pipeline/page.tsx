import PipelineBoard from "./components/PipelineBoard";

export default function PipelinePage() {
  return (
    <div className="px-8 pt-8 pb-4 flex flex-col h-full gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Placement Pipeline</h1>
        <p className="text-sm text-gray-500">Track students across placement stages</p>
      </div>

      {/* Drive Info */}
      <div className="bg-white border rounded-xl p-4 flex justify-around text-sm mr-200 text-center">
        <div>
          <p className="text-gray-500">Company</p>
          <p className="font-medium">Amazon</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium">SDE Intern</p>
        </div>

        <div>
          <p className="text-gray-500">Package</p>
          <p className="font-medium">₹18 LPA</p>
        </div>

        <div>
          <p className="text-gray-500">Applicants</p>
          <p className="font-medium">120</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <PipelineBoard />
      </div>
    </div>
  );
}
