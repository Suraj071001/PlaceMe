import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar";
import { PageTitle } from "@repo/ui/components/page-title";
import { StudentAuthGuard } from "../components/student-auth-guard";

const navItems = [
  { title: "Dashboard", url: "/", icon: "LayoutDashboard" },
  { title: "Jobs", url: "/jobs", icon: "Briefcase" },
  { title: "Applications", url: "/applications", icon: "FileText" },
  { title: "Resume Builder", url: "/resume-builder", icon: "FilePen" },
  { title: "Notifications", url: "/notifications", icon: "Bell" },
  { title: "Profile", url: "/profile", icon: "User" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StudentAuthGuard>
      <SidebarProvider>
        <AppSidebar className="" navItems={navItems} collapsible="icon" />
        <SidebarInset className="text-black min-w-[78%] max-w-full">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <PageTitle navItems={navItems} />
          </header>
          <main className="flex-1 overflow-hidden p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </StudentAuthGuard>
  );
}
