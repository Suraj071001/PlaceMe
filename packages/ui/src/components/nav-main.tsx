"use client";

import { icons, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";

export type NavItem = {
  title: string;
  url: string;
  icon?: string;
};

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon: LucideIcon | undefined = item.icon
            ? (icons as Record<string, LucideIcon>)[item.icon]
            : undefined;
          return (
            <SidebarMenuItem key={item.title}>
              <Link href={`${item.url}`} className="w-full">
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  {Icon && <Icon className="size-4" />}
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
