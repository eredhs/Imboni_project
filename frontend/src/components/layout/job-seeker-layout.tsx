"use client";

import { ProtectRoute } from "@/components/auth/protect-route";
import { SeekerNavbar } from "@/components/layout/seeker-navbar";

export function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectRoute requiredRole="job_seeker">
      <div className="min-h-screen bg-slate-950">
        <SeekerNavbar />
        <div>{children}</div>
      </div>
    </ProtectRoute>
  );
}
