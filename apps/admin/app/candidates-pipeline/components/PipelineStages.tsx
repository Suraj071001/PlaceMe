import StudentCard from "./PipelineCard";

interface Stage {
  id: string;
  color: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
  branch: string;
  status: string;
  date: string;
  stage: string;
}

type Props = {
  stage: Stage;
  students: Student[];
  selected: string[];
  toggleSelect: (id: string) => void;
};

export default function PipelineStage({ stage, students, selected, toggleSelect }: Props) {
  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col h-full">
      {/* Header */}
      <div className={`px-5 py-4 mb-1 rounded-t-xl ${stage.color}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide">{stage.title}</h3>

          <span className="text-xs bg-white px-2.5 py-0.5 rounded-full">{students.length}</span>
        </div>

        <p className="text-xs text-gray-600 mt-2">⚡ Auto Email</p>
      </div>

      {/* Students */}
      <div className="bg-gray-50 rounded-b-xl p-3 space-y-3 flex-1 min-h-0 overflow-y-auto stage-scroll">
        {students.length === 0 && <p className="text-xs text-gray-400 text-center pt-6">No students</p>}

        {students.map((student) => (
          <StudentCard key={student.id} student={student} selected={selected.includes(student.id)} toggleSelect={toggleSelect} />
        ))}
      </div>
    </div>
  );
}
