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
  onViewForm?: (id: string) => void;
};

export default function PipelineStage({ stage, students, selected, toggleSelect, onViewForm }: Props) {
  return (
    <div className="min-h-0 w-full min-w-0 rounded-xl border border-gray-100 bg-white/70 p-1">
      {/* Header */}
      <div className={`mb-1 rounded-t-xl px-4 py-3 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide">{stage.title}</h3>

          <span className="text-xs bg-white px-2.5 py-0.5 rounded-full">{students.length}</span>
        </div>

        <p className="text-xs text-gray-600 mt-2">⚡ Auto Email</p>
      </div>

      {/* Students */}
      <div className="stage-scroll min-h-0 space-y-3 overflow-y-auto rounded-b-xl bg-gray-50 p-3">
        {students.length === 0 && <p className="text-xs text-gray-400 text-center pt-6">No students</p>}

        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            selected={selected.includes(student.id)}
            toggleSelect={toggleSelect}
            onViewForm={onViewForm}
          />
        ))}
      </div>
    </div>
  );
}
