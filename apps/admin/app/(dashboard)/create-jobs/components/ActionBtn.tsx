export default function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 sm:w-auto">
      {icon} {label}
    </button>
  );
}
