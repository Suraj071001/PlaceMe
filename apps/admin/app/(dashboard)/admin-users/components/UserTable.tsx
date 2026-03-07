"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { PermissionsDialog } from "./PermissionsDialog";
import { EditPermissionsDialog } from "./EditPermissionsDialog";
import { API_BASE } from "../../../lib/api";

type RoleRef = {
  id: string;
  name: string;
};

type Permission = {
  id: string;
  name: string;
  description?: string | null;
};

type AdminUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: RoleRef | null;
  isActive: boolean;
  createdAt: string;
};

type RolePermissionRow = {
  permissionId: string;
  permission: Permission;
};

const getTokenPermissions = () => {
  const token = localStorage.getItem("token");
  if (!token) return new Set<string>();

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return new Set<string>();

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64)) as { permissions?: string[] };
    return new Set(payload.permissions || []);
  } catch {
    return new Set<string>();
  }
};

export function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleRef[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<string, Permission[]>
  >({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [canViewPermissions, setCanViewPermissions] = useState(false);
  const [canManagePermissions, setCanManagePermissions] = useState(false);

  useEffect(() => {
    const tokenPermissions = getTokenPermissions();
    const canRead = tokenPermissions.has("READ_ROLE_PERMISSION");
    const canManage = tokenPermissions.has("MANAGE_ROLE_PERMISSION");
    setCanViewPermissions(canRead || canManage);
    setCanManagePermissions(canManage);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token") ?? "";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [usersRes, rolesRes, permsRes] = await Promise.all([
          fetch(`${API_BASE}/admins`, { method: "GET", headers }),
          fetch(`${API_BASE}/role`, { method: "GET", headers }),
          fetch(`${API_BASE}/permission`, { method: "GET", headers }),
        ]);

        const usersJson = await usersRes.json();
        const rolesJson = await rolesRes.json();
        const permsJson = await permsRes.json();

        const fetchedUsers = (usersJson?.data || []) as AdminUser[];
        const fetchedRoles = (rolesJson?.data || []) as RoleRef[];
        const fetchedPermissions = (permsJson?.data || []) as Permission[];

        setUsers(fetchedUsers);
        setRoles(fetchedRoles);
        setAllPermissions(fetchedPermissions);

        const rolePermissionEntries = await Promise.all(
          fetchedRoles.map(async (role) => {
            const res = await fetch(`${API_BASE}/role-permission/role/${role.id}`, {
              method: "GET",
              headers,
            });
            const json = await res.json();
            const rows = (json?.data || []) as RolePermissionRow[];
            return [role.id, rows.map((row) => row.permission)] as const;
          }),
        );

        setPermissionsByRole(Object.fromEntries(rolePermissionEntries));
      } catch (error) {
        console.error("Failed to fetch admin-role data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const searchMatch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = roleFilter === "all" || u.role?.id === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const updateRolePermissions = async (
    roleId: string,
    selectedPermissionIds: string[],
  ) => {
    const token = localStorage.getItem("token") ?? "";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const currentPermissionIds = new Set(
      (permissionsByRole[roleId] || []).map((p) => p.id),
    );
    const nextPermissionIds = new Set(selectedPermissionIds);

    const toAdd = [...nextPermissionIds].filter((id) => !currentPermissionIds.has(id));
    const toRemove = [...currentPermissionIds].filter((id) => !nextPermissionIds.has(id));

    const addCalls = toAdd.map((permissionId) =>
      fetch(`${API_BASE}/role-permission`, {
        method: "POST",
        headers,
        body: JSON.stringify({ roleId, permissionId }),
      }),
    );

    const removeCalls = toRemove.map((permissionId) =>
      fetch(`${API_BASE}/role-permission`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ roleId, permissionId }),
      }),
    );

    const results = await Promise.all([...addCalls, ...removeCalls]);
    const failed = results.find((res) => !res.ok);
    if (failed) {
      const err = await failed.json().catch(() => ({}));
      throw new Error(err?.error || err?.message || "Failed to update role permissions");
    }

    setPermissionsByRole((prev) => ({
      ...prev,
      [roleId]: allPermissions.filter((p) => nextPermissionIds.has(p.id)),
    }));
  };

  if (loading) {
    return <div className="p-4 text-sm text-slate-500">Loading admin users...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-3 lg:flex-row lg:items-center">
        <div className="relative w-full flex-1 text-slate-500">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg text-slate-600"
          />
        </div>
        <div className="w-full lg:w-64">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-sm text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin User";
                const roleId = user.role?.id || "";
                const roleName = user.role?.name || "No Role";
                const rolePermissions = permissionsByRole[roleId] || [];

                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">{fullName}</td>
                    <td className="px-4 py-4 text-slate-600">{user.email}</td>
                    <td className="px-4 py-4 text-slate-700">{roleName}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {canViewPermissions && (
                          <PermissionsDialog
                            userName={fullName}
                            role={roleName}
                            permissions={rolePermissions}
                          />
                        )}

                        {canManagePermissions && roleId && (
                          <EditPermissionsDialog
                            userName={fullName}
                            role={roleName}
                            allPermissions={allPermissions}
                            selectedPermissionIds={rolePermissions.map((p) => p.id)}
                            onSave={async (newPermissionIds) => {
                              try {
                                await updateRolePermissions(roleId, newPermissionIds);
                              } catch (error: any) {
                                alert(error?.message || "Failed to update permissions");
                              }
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No users found for current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500">
          Showing {filteredUsers.length === 0 ? 0 : startIndex + 1}-
          {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </p>

        <div className="flex flex-wrap items-center gap-2">
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
