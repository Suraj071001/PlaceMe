"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
  }[];
}) {

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={`${item.url}`} className="w-full">
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                {item.title}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
