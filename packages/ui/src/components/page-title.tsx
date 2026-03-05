"use client";

import { usePathname } from "next/navigation";

export function PageTitle({ navItems }: { navItems: { title: string; url: string }[] }) {
    const pathname = usePathname();
    const current = navItems.find((item) => item.url === pathname);
    return <h1 className="text-lg font-semibold ">{current?.title ?? "Dashboard"}</h1>;
}
