"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import { NavMain, type NavItem } from "./nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "./sidebar";

export function AppSidebar({ navItems, ...props }: React.ComponentProps<typeof Sidebar> & { navItems: NavItem[] }) {
  const handleLogout = () => {
    // Clear any authentication tokens
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="group flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50">
                <div className="mt-0.5 flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <img src="https://www.nita.ac.in/images/logo.png" alt="NITA logo" className="h-8 w-8 object-contain" loading="lazy" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-base font-bold leading-5 tracking-tight text-slate-900">NIT Agartala</span>
                  <span className="mt-0.5 whitespace-normal break-words text-[11px] leading-snug text-slate-500 group-hover:text-slate-700">
                    National Institute of Technology
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className={`border-t-2 bg-white`}>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={handleLogout} className="cursor-pointer">
            <div className="flex w-full items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <LogOut className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Logout</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
