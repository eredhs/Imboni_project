"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingShell } from "@/components/landing/landing-shell";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    switch (user.role) {
      case "recruiter":
        router.replace("/dashboard");
        break;
      case "job_seeker":
        router.replace("/seeker/dashboard");
        break;
      case "system_controller":
        router.replace("/admin/dashboard");
        break;
    }
  }, [isLoading, router, user]);

  if (!isLoading && !user) {
    return <LandingShell />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101720]">
      <div className="h-10 w-10 animate-spin rounded-full border-r-2 border-t-2 border-[#2FD67D]" />
    </div>
  );
}
