"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { PermissionsDialog } from "./PermissionsDialog";
import { EditPermissionsDialog } from "./EditPermissionsDialog";

const getDefaultPermissions = (role: string): Record<string, boolean> => {
  const isDirector = role === "Director";
  const isPH = role === "Placement Head" || isDirector;
  const isFC = role === "Faculty Coordinator" || isPH;
  const isIC = role === "IC" || isPH;
  const isPC = role === "PC" || isPH;

  return {
    view_global: isDirector,
    edit_platform: isDirector,
    edit_policies: isDirector,
    approve_final: isDirector,
    view_reports: isPH,
    edit_schedules: isPH,
    edit_jobs: isPH,
    manage_fc: isPH,
    view_dept: isFC,
    verify_profiles: isFC,
    edit_records: isFC,
    manage_insights: isFC,
    view_intern_co: isIC,
    view_intern_apps: isIC,
    view_resumes_ic: isIC,
    view_interviews_ic: isIC,
    view_place_co: isPC,
    view_job_posts: isPC,
    view_place_status: isPC,
    view_results: isPC,
  };
};

const initialUsers = [
  {
    id: 1,
    name: "Dr Sharma",
    email: "sharma@college.edu",
    role: "Director",
    responsibility: "Placement Oversight",
    department: "All",
    branch: "All",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Gupta",
    email: "rahul@college.edu",
    role: "Faculty Coordinator",
    responsibility: "Campus Drives",
    department: "Placement Cell",
    branch: "MCA",
    status: "Active",
  },
  {
    id: 3,
    name: "Neha Singh",
    email: "neha@college.edu",
    role: "IC",
    responsibility: "Internship Coordination",
    department: "CSE",
    branch: "B Tech",
    status: "Active",
  },
  {
    id: 4,
    name: "Prof. Kumar",
    email: "kumar@college.edu",
    role: "PC",
    responsibility: "Student Placement",
    department: "Mechanical",
    branch: "B Tech",
    status: "Active",
  },
].map((u) => ({ ...u, permissions: getDefaultPermissions(u.role) }));

export function UserTable() {
  const [users, setUsers] = useState(initialUsers);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const searchMatch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = roleFilter === "all" || u.role === roleFilter;
      const deptMatch = departmentFilter === "all" || u.department === departmentFilter;
      const branchMatch = branchFilter === "all" || u.branch === branchFilter;
      return searchMatch && roleMatch && deptMatch && branchMatch;
    });
  }, [users, searchQuery, roleFilter, departmentFilter, branchFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, departmentFilter, branchFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentUserRole = "Director";

  const canEditUser = (targetRole: string) => {
    if (["IC", "PC"].includes(targetRole)) {
      return false;
    }

    if (currentUserRole === "Director") {
      return true;
    }

    if (currentUserRole === "Placement Head") {
      return targetRole !== "Director";
    }

    if (currentUserRole === "Faculty Coordinator") {
      return targetRole === "Faculty Coordinator";
    }

    return false;
  };

  const handleUpdatePermissions = (userId: number, newPermissions: Record<string, boolean>) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, permissions: newPermissions } : u)));
  };

  const canViewPermissions = (targetUser: any) => {
    if (currentUserRole === "Director") return true;

    if (currentUserRole === "Placement Head") {
      return targetUser.role === "Placement Head";
    }

    if (currentUserRole === "Faculty Coordinator") {
      return targetUser.role === "Faculty Coordinator";
    }

    if (["IC", "PC"].includes(currentUserRole)) {
      return targetUser.role === currentUserRole;
    }

    return false;
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center p-3 border-b border-slate-100">
        <div className="relative flex-1 text-slate-500">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg text-slate-600"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Roles</option>
            <option value="Director">Director</option>
            <option value="Faculty Coordinator">Faculty Coordinator</option>
            <option value="Placement Head">Placement Head</option>
            <option value="IC">IC</option>
            <option value="PC">PC</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Departments</option>
            <option value="Placement Cell">Placement Cell</option>
            <option value="CSE">CSE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="All">All</option>
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Branches</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="MSC">MSC</option>
            <option value="B Tech">B Tech</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-sm text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Responsibility</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Branch</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-4 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    {user.email}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-external-link"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">{user.role}</td>
                <td className="px-4 py-4 text-slate-700">{user.responsibility}</td>
                <td className="px-4 py-4 text-slate-600 font-medium">{user.department}</td>
                <td className="px-4 py-4 text-slate-600 font-medium">{user.branch}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {canViewPermissions(user) && <PermissionsDialog userName={user.name} role={user.role} permissions={user.permissions} />}

                    {canEditUser(user.role) && (
                      <EditPermissionsDialog
                        userName={user.name}
                        role={user.role}
                        permissions={user.permissions}
                        onSave={(newPerms) => handleUpdatePermissions(user.id, newPerms)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                No users found for current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
        <p className="text-slate-500">
          Showing {filteredUsers.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-9 rounded-lg border border-slate-200 px-3 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="min-w-24 text-center text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-9 rounded-lg border border-slate-200 px-3 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
