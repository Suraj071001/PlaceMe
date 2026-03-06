import { AddUserDialog } from "./components/AddUserDialog";
import { UserTable } from "./components/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin Management</h1>
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
