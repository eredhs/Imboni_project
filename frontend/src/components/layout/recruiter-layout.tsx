"use client";

import { ProtectRoute } from "@/components/auth/protect-route";
import { AppShell } from "@/components/layout/app-shell";
import { usePathname } from "next/navigation";

type NavKey = "dashboard" | "jobs" | "applicants" | "screening" | "shortlist" | "reports" | "settings";

export function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveNav = (): NavKey => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/jobs")) return "jobs";
    if (pathname.startsWith("/applicants")) return "applicants";
    if (pathname.startsWith("/screening")) return "screening";
    if (pathname.startsWith("/shortlist")) return "shortlist";
    if (pathname.startsWith("/reports")) return "reports";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  return (
    <ProtectRoute requiredRole="recruiter">
      <AppShell activeNav={getActiveNav()}>
        {children}
      </AppShell>
    </ProtectRoute>
  );
}
