import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar";
import { PageTitle } from "@repo/ui/components/page-title";

const navItems = [
    { title: "Dashboard", url: "/" },
    { title: "Create Jobs", url: "/create-jobs" },
    { title: "All Jobs", url: "/all-jobs" },
    { title: "Candidates", url: "/candidates-pipeline" },
    { title: "Reports", url: "/reports" },
    { title: "Integrations", url: "/integrations" },
    { title: "Admin-Roles", url: "/admin-users" },
];

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar navItems={navItems} />
            <SidebarInset className="text-black">
                <header className="sticky flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <PageTitle navItems={navItems} />
                </header>
                <main className="flex-1 min-h-0 overflow-hidden bg-[#f5f7fb]">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
