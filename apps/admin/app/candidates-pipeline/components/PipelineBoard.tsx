"use client";

import { useState } from "react";
import { stages, students as initialStudents, stageOrder } from "../../components/data";
import PipelineStage from "./PipelineStages";

export default function PipelineBoard() {
  const [students, setStudents] = useState(initialStudents);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const moveSelectedForward = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (!selected.includes(String(s.id))) return s;

        const currentIndex = stageOrder.indexOf(s.stage);
        const nextStage = stageOrder[currentIndex + 1];

        if (!nextStage) return s;

        return { ...s, stage: nextStage };
      }),
    );

    setSelected([]);
  };

  return (
    <div className="relative h-full">
      {/* Scroll container */}
      <div className="h-full w-full overflow-x-auto overflow-y-hidden pipeline-scroll">
        {/* Board */}
        <div className="flex gap-6 h-full px-8 w-max mr-50">
          {stages.map((stage) => {
            const stageStudents = students.filter((s) => s.stage === stage.id).map((s) => ({ ...s, id: String(s.id) }));

            return <PipelineStage key={stage.id} stage={stage} students={stageStudents} selected={selected} toggleSelect={toggleSelect} />;
          })}
        </div>
      </div>

      {/* Bulk Action */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-lg px-6 py-3 rounded-lg flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selected.length} selected</span>

          <button onClick={moveSelectedForward} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm">
            Move Forward
          </button>

          <button onClick={() => setSelected([])} className="text-sm text-gray-500 hover:text-gray-700">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
