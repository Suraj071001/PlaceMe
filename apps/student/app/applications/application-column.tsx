import { ApplicationCard, type Application } from "./application-card";

type ApplicationColumnProps = {
    status: string;
    applications: Application[];
};

export function ApplicationColumn({ status, applications }: ApplicationColumnProps) {
    return (
        <div className="flex min-w-[260px] flex-1 flex-col">
            {/* Column header */}
            <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-gray-700">{status}</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-50 px-1.5 text-xs font-semibold text-indigo-600">
                    {applications.length}
                </span>
            </div>

            {/* Cards list */}
            <div className="flex flex-1 flex-col gap-3 rounded-xl bg-gray-50/70 p-3">
                {applications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-gray-400">
                        No applications
                    </p>
                ) : (
                    applications.map((app) => (
                        <ApplicationCard key={app.id} application={app} />
                    ))
                )}
            </div>
        </div>
    );
}
