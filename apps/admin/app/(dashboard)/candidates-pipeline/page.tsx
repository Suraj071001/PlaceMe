import PipelineBoard from "./components/PipelineBoard";

export default function PipelinePage() {
  return (
    <div className="flex h-full flex-col gap-6 px-3 pb-4 pt-4 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Placement Pipeline</h1>
        <p className="text-sm text-gray-500">Track students across placement stages</p>
      </div>

      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        <PipelineBoard />
      </div>
    </div>
  );
}
