"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BarChart2,
  Bell,
  Briefcase,
  Star,
  Cpu,
  LogOut,
  Search,
  Settings,
  Users,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Eye,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import ImboniLogo from "../auth/ImboniLogo";
import { useGetCurrentUserQuery } from "@/store/api/auth-api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeDrawer, toggleMobileSidebar } from "@/store/ui-slice";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";

type NavKey =
  | "dashboard"
  | "jobs"
  | "applicants"
  | "screening"
  | "shortlist"
  | "reports"
  | "settings";

type AppShellProps = {
  activeNav: NavKey;
  children: ReactNode;
};

interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  icon: ReactNode;
  section: "recruitment" | "system";
}

const navItems: NavItem[] = [
  // RECRUITMENT
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    section: "recruitment",
  },
  {
    key: "jobs",
    label: "Jobs",
    href: "/jobs",
    icon: <Briefcase size={18} />,
    section: "recruitment",
  },
  {
    key: "applicants",
    label: "Applicants",
    href: "/applicants",
    icon: <Users size={18} />,
    section: "recruitment",
  },
  {
    key: "screening",
    label: "AI Screening",
    href: "/screening",
    icon: <Cpu size={18} />,
    section: "recruitment",
  },
  {
    key: "shortlist",
    label: "Shortlist",
    href: "/shortlist",
    icon: <Star size={18} />,
    section: "recruitment",
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: <BarChart2 size={18} />,
    section: "recruitment",
  },
  // SYSTEM
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings size={18} />,
    section: "system",
  },
];

export function AppShell({ activeNav, children }: AppShellProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { logout, user: authContextUser } = useAuth();
  
  // Hardened defensive selector to prevent the TypeError reported in your logs
  const { drawerOpen, drawerCandidateId, mobileSidebarOpen } = useSelector(
    (state: RootState) => (state as any).ui || { drawerOpen: false, drawerCandidateId: null, mobileSidebarOpen: false }
  );

  const accessToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("talentlens_access_token")
      : null;

  const { data: currentUser, isLoading, isError } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !accessToken,
    }
  );

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (isError) {
      window.localStorage.removeItem("talentlens_access_token");
      window.localStorage.removeItem("talentlens_refresh_token");
      router.replace("/login");
    }
  }, [isError, router]);

  if (!accessToken || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-3 text-imboni-primary">
            <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={2} />
            <span className="text-sm font-medium text-gray-900">Loading your workspace...</span>
          </div>
        </div>
      </main>
    );
  }

  const recruitmentItems = navItems.filter((item) => item.section === "recruitment");
  const systemItems = navItems.filter((item) => item.section === "system");

  return (
    <main className="min-h-screen flex bg-white">
      {/* MOBILE BACKDROP */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => dispatch(toggleMobileSidebar())}
        />
      )}

      {/* SIDEBAR */}
      <aside className={clsx(
        "w-[220px] bg-[#0F172A] fixed left-0 top-0 h-full flex flex-col overflow-hidden z-50 transition-transform duration-300 lg:translate-x-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">
          <ImboniLogo size="sm" showTagline={false} inline />
          <button className="lg:hidden text-slate-400" onClick={() => dispatch(toggleMobileSidebar())}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          {/* RECRUITMENT Section */}
          <div className="px-5 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Recruitment
            </p>
            <ul className="space-y-1">
              {recruitmentItems.map((item) => (
                <li key={item.key}>
                  {/* Active detection using the pattern: pathname === item.href */}
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 mx-1",
                      (pathname === item.href || pathname.startsWith(item.href + '/'))
                        ? "bg-[#312E81] text-white"
                        : "text-slate-400 hover:bg-[#1E293B] hover:text-white",
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SYSTEM Section */}
          <div className="px-5 mt-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              System
            </p>
            <ul className="space-y-1">
              {systemItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 mx-1",
                      (pathname === item.href || pathname.startsWith(item.href + '/'))
                        ? "bg-[#312E81] text-white"
                        : "text-slate-400 hover:bg-[#1E293B] hover:text-white",
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    logout();
                    window.localStorage.removeItem("talentlens_user");
                    window.localStorage.removeItem("talentlens_access_token");
                    window.localStorage.removeItem("talentlens_refresh_token");
                    router.replace("/login");
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-150 mx-1"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[220px] flex flex-col bg-white min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-500" onClick={() => dispatch(toggleMobileSidebar())}>
              <Menu size={20} />
            </button>
            {/* Search */}
            <label className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-72">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates, jobs, reports..."
                className="flex-1 bg-transparent border-none text-sm outline-none placeholder:text-gray-500"
              />
            </label>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">{currentUser?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-imboni-primary-md to-imboni-primary flex items-center justify-center text-xs font-semibold text-white">
                {getInitials(currentUser?.name ?? "SJ")}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* GLOBAL DRAWER */}
      <CandidateDrawer 
        candidateId={drawerCandidateId}
        open={drawerOpen}
        onClose={() => dispatch(closeDrawer())}
      />
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
