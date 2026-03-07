"use client";

export type RoutePermissionRule = {
  prefix: string;
  anyOf: string[];
};

// Keep these names synced with backend permissionMiddleware names.
export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  { prefix: "/", anyOf: ["READ_REPORTS"] },
  { prefix: "/create-jobs", anyOf: ["CREATE_JOB"] },
  { prefix: "/application-form", anyOf: ["CREATE_JOB"] },
  { prefix: "/review-publish-jobs", anyOf: ["CREATE_JOB"] },
  { prefix: "/all-jobs", anyOf: ["READ_JOBS"] },
  { prefix: "/candidates-pipeline", anyOf: ["READ_APPLICATION_ADMIN"] },
  { prefix: "/company-list", anyOf: ["READ_COMPANY"] },
  { prefix: "/reports", anyOf: ["READ_REPORTS"] },
  { prefix: "/integrations", anyOf: ["MANAGE_USERS"] },
  { prefix: "/admin-users", anyOf: ["MANAGE_USERS"] },
];

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/" },
  { title: "Create Jobs", url: "/create-jobs" },
  { title: "All Jobs", url: "/all-jobs" },
  { title: "Candidates", url: "/candidates-pipeline" },
  { title: "Company List", url: "/company-list" },
  { title: "Reports", url: "/reports" },
  { title: "Integrations", url: "/integrations" },
  { title: "Admin-Roles", url: "/admin-users" },
] as const;

const normalize = (path: string) => {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export const getRuleForPath = (path: string) => {
  const normalizedPath = normalize(path);

  const sortedRules = [...ROUTE_PERMISSION_RULES].sort((a, b) => b.prefix.length - a.prefix.length);
  return sortedRules.find((rule) => {
    const prefix = normalize(rule.prefix);
    if (prefix === "/") return normalizedPath === "/";
    return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
  });
};

export const canAccessPath = (path: string, permissions: string[]) => {
  const rule = getRuleForPath(path);
  if (!rule) return true;
  return rule.anyOf.some((permission) => permissions.includes(permission));
};

export const filterNavItemsByPermission = (permissions: string[]) =>
  NAV_ITEMS.filter((item) => canAccessPath(item.url, permissions));
