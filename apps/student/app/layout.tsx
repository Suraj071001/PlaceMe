import type { Metadata } from "next";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar";
import { PageTitle } from "@repo/ui/components/page-title";

import "./globals.css";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Student Portal",
};

const navItems = [
  { title: "Dashboard", url: "/", icon: "LayoutDashboard" },
  { title: "Jobs", url: "/jobs", icon: "Briefcase" },
  { title: "Applications", url: "/applications", icon: "FileText" },
  { title: "Resume Builder", url: "/resume-builder", icon: "FilePen" },
  { title: "Mock Interview", url: "/mock-interview", icon: "MessageSquare" },
  { title: "Analytics", url: "/analytics", icon: "BarChart3" },
  { title: "Notifications", url: "/notifications", icon: "Bell" },
  { title: "Profile", url: "/profile", icon: "User" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar navItems={navItems} />
          <SidebarInset className="text-black">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <PageTitle navItems={navItems} />
            </header>
            <main className="flex-1 p-4">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
