type ApplicationStatusCardProps = {
    count: number;
    label: string;
};

export function ApplicationStatusCard({ count, label }: ApplicationStatusCardProps) {
    return (
        <div className="flex min-w-[100px] flex-1 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-4 shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">{count}</span>
            <span className="mt-1 text-xs font-medium text-gray-500">{label}</span>
        </div>
    );
}
