"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function ProtectRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "recruiter" | "job_seeker" | "system_controller";
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user && requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard if user has wrong role
      if (user.role === "recruiter") {
        router.push("/dashboard");
      } else if (user.role === "job_seeker") {
        router.push("/seeker/dashboard");
      } else if (user.role === "system_controller") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2"></div>
      </div>
    );
  }

  return <>{children}</>;
}
