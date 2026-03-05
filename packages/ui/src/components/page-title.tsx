"use client";

import { usePathname } from "next/navigation";

export function PageTitle({ navItems }: { navItems: { title: string; url: string }[] }) {
  const pathname = usePathname();
  const current = navItems.find((item) => item.url === pathname);

  const defaultTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .split("/")
          .filter(Boolean)
          .map((segment) =>
            segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          )
          .join(" - ") || "Dashboard";

  return <h1 className="text-lg font-semibold ">{current?.title ?? defaultTitle}</h1>;
}
