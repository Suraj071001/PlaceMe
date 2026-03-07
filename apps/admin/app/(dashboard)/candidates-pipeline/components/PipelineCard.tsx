import { Clock } from "lucide-react";

interface Student {
  id: string;
  name: string;
  branch: string;
  status: string;
  date: string;
  stage: string;
}

interface Props {
  student: Student;
  selected: boolean;
  toggleSelect: (id: string) => void;
}

export default function StudentCard({ student, selected, toggleSelect }: Props) {
  const initials = student.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm transition hover:shadow">
      {/* Checkbox */}
      <div className="flex justify-end">
        <input type="checkbox" checked={selected} onChange={() => toggleSelect(student.id)} className="cursor-pointer" />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">{initials}</div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{student.name}</p>
          <p className="truncate text-xs text-gray-500">{student.branch}</p>
        </div>
      </div>

      <div className="mt-2 min-w-0">
        <span className="inline-block max-w-full truncate rounded bg-gray-100 px-2 py-0.5 text-xs">{student.status}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <Clock size={12} />
        {student.date}
      </div>
    </div>
  );
}
