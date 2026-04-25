"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Briefcase, FileText, Home, LogOut, Menu, User, Video, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import ImboniLogo from "../auth/ImboniLogo";
import { useGetApplicationsByUserQuery, useGetNotificationsQuery } from "@/store/api/applications-api";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
}

export function SeekerNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userId = user?.id ?? "";
  const { data: applicationsData } = useGetApplicationsByUserQuery(userId, { skip: !userId });
  const { data: notificationsData } = useGetNotificationsQuery(userId, { skip: !userId });

  const applications = applicationsData?.data ?? [];
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/seeker/dashboard",
      icon: <Home size={22} className="stroke-[1.5]" />,
    },
    {
      label: "Find Jobs",
      path: "/seeker/browse",
      icon: <Briefcase size={22} className="stroke-[1.5]" />,
    },
    {
      label: "Applications",
      path: "/seeker/applications",
      icon: <FileText size={22} className="stroke-[1.5]" />,
      badge: applications.length,
    },
    {
      label: "Interviews",
      path: "/seeker/interviews",
      icon: <Video size={22} className="stroke-[1.5]" />,
      badge: applications.filter((application) => application.status === "interview_scheduled").length,
    },
  ];

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem("talentlens_user");
    window.localStorage.removeItem("talentlens_access_token");
    window.localStorage.removeItem("talentlens_refresh_token");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/seeker/dashboard")}
              className="flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <ImboniLogo size="sm" showTagline={false} inline />
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  pathname === item.path
                    ? "bg-emerald-500 text-white"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-current">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => router.push("/seeker/notifications")}
              className="relative rounded-lg p-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-white"
              title="Notifications"
            >
              <Bell size={20} className="stroke-[1.5]" />
              {(notificationsData?.unreadCount ?? 0) > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationsData?.unreadCount}
                </span>
              ) : null}
            </button>

            <div className="hidden items-center gap-3 border-l border-slate-700/50 pl-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-500">Job Seeker</p>
              </div>
              <button
                onClick={() => router.push("/seeker/profile")}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                title="Profile"
              >
                {user?.name?.[0] || "U"}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-950/30 hover:text-red-300 sm:flex"
            >
              <LogOut size={18} className="stroke-[1.5]" />
              <span>Logout</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X size={20} className="stroke-[1.5]" /> : <Menu size={20} className="stroke-[1.5]" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-1 border-t border-slate-700/50 pb-4 pt-4 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}

            <button
              onClick={() => {
                router.push("/seeker/profile");
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-all hover:bg-slate-800/40 hover:text-white"
            >
              <User size={20} className="stroke-[1.5]" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-all hover:bg-red-950/30 hover:text-red-300"
            >
              <LogOut size={20} className="stroke-[1.5]" />
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
