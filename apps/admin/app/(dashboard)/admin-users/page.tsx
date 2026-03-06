import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";
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
        <div className="flex gap-4 items-center p-3">
          <div className="relative flex-1 text-slate-500">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-9 bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg text-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50">
              <option value="" disabled selected>
                Role
              </option>
              <option value="all">All Roles</option>
              <option value="director">Director</option>
              <option value="placement_officer">Faculty Coordinator</option>
              <option value="ic">IC</option>
              <option value="pc">PC</option>
            </select>

            <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50">
              <option value="" disabled selected>
                Department
              </option>
              <option value="all">All Departments</option>
              <option value="placement_cell">Placement Cell</option>
              <option value="cse">CSE</option>
              <option value="mechanical">Mechanical</option>
            </select>

            <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50">
              <option value="" disabled selected>
                Branch
              </option>
              <option value="all">All Branches</option>
              <option value="mca">MCA</option>
              <option value="mba">MBA</option>
              <option value="msc">MSC</option>
              <option value="btech">B Tech</option>
            </select>
          </div>
        </div>

        <div className="px-3 pb-3">
          <UserTable />
        </div>
      </div>
    </div>
  );
}
