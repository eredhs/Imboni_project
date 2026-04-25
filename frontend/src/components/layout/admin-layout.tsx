"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { ProtectRoute } from "@/components/auth/protect-route";
import { useAuth } from "@/lib/auth-context";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <ProtectRoute requiredRole="system_controller">
      <div className="min-h-screen bg-slate-950">
        <nav className="border-b border-amber-900/30 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="text-lg font-semibold text-white hover:text-slate-200"
                >
                  Admin Dashboard
                </button>

                <div className="hidden space-x-1 md:flex">
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => router.push("/admin/moderation")}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Moderation
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-amber-100">{user?.name}</span>
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="rounded-lg p-2 text-amber-100/70 hover:bg-slate-800/60 hover:text-amber-100"
                  title="Admin settings"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => {
                    logout();
                    window.localStorage.removeItem("talentlens_user");
                    window.localStorage.removeItem("talentlens_access_token");
                    window.localStorage.removeItem("talentlens_refresh_token");
                    router.push("/login");
                  }}
                  className="rounded-lg border border-amber-700 bg-amber-950/20 px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-950/40"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div>{children}</div>
      </div>
    </ProtectRoute>
  );
}
