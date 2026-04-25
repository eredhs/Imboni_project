"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

export function AppNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const getDashboardLink = () => {
    switch (user.role) {
      case "recruiter":
        return "/dashboard";
      case "job_seeker":
        return "/seeker/dashboard";
      case "system_controller":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => router.push(getDashboardLink())}
            className="text-lg font-semibold text-white hover:text-slate-200"
          >
            Dashboard
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.name}</span>
            <button
              onClick={() =>
                router.push(user.role === "job_seeker" ? "/seeker/profile" : "/settings")
              }
              className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-300"
              title="Profile Settings"
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
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              <LogOut size={16} className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
