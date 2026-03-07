"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar";
import { PageTitle } from "@repo/ui/components/page-title";
import { canAccessPath, filterNavItemsByPermission } from "../lib/route-permissions";
import { getPermissionsFromToken } from "../lib/jwt-permissions";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [permissions, setPermissions] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const parsedPermissions = getPermissionsFromToken(token);
    setPermissions(parsedPermissions);
    setReady(true);
  }, [router]);

  const allowedNavItems = useMemo(() => filterNavItemsByPermission(permissions), [permissions]);

  useEffect(() => {
    if (!ready) return;

    if (!canAccessPath(pathname, permissions)) {
      const fallback = allowedNavItems[0]?.url ?? "/login";
      router.replace(fallback);
    }
  }, [allowedNavItems, pathname, permissions, ready, router]);

  if (!ready) return null;

  return (
    <SidebarProvider>
      <AppSidebar navItems={allowedNavItems} />
      <SidebarInset className="text-black">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 hidden data-[orientation=vertical]:h-4 sm:block" />
          <PageTitle navItems={allowedNavItems} />
        </header>
        <main className="flex-1 min-h-0 overflow-auto bg-[#f5f7fb]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
