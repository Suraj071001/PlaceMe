"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StudentAuthGuardProps = {
  children: React.ReactNode;
};

export function StudentAuthGuard({ children }: StudentAuthGuardProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      setAuthenticated(false);
      setChecked(true);
      return;
    }

    setAuthenticated(true);
    setChecked(true);
  }, [router]);

  if (!checked) {
    return <div className="p-6 text-sm text-muted-foreground">Checking authentication...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
