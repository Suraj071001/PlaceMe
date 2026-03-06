import "./globals.css";

import type { Metadata } from "next";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar";
import { PageTitle } from "@repo/ui/components/page-title";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const navItems = [
  { title: "Dashboard", url: "/" },
  { title: "Create Jobs", url: "/create-jobs" },
  { title: "All Jobs", url: "/all-jobs" },
  { title: "Candidates", url: "/candidates-pipeline" },
  { title: "Reports", url: "/reports" },
  { title: "Integrations", url: "/integrations" },
  { title: "Admin-Roles", url: "/admin-users" },
];

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar navItems={navItems} />
          <SidebarInset className="text-black">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <PageTitle navItems={navItems} />
            </header>
            <main className="flex-1 min-h-0 overflow-hidden bg-[#f5f7fb]">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
