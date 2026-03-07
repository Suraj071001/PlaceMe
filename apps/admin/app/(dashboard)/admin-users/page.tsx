import { AddUserDialog } from "./components/AddUserDialog";
import { UserTable } from "./components/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Admin Management</h1>
          <p className="text-slate-500 mt-1">Manage students and admins</p>
        </div>
        <AddUserDialog />
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-2">
        <div className="px-3 pb-3">
          <UserTable />
        </div>
      </div>
    </div>
  );
}
