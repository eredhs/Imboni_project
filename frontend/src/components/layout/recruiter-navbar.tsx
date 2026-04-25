"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut,Home, Briefcase, Users, BarChart3, Settings, Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function RecruiterNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
    },
    {
      label: "Jobs",
      path: "/jobs",
      icon: <Briefcase size={20} />,
    },
    {
      label: "Candidates",
      path: "/applicants",
      icon: <Users size={20} />,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Screening",
      path: "/screening",
      icon: <BarChart3 size={20} />,
    },
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem("talentlens_user");
    window.localStorage.removeItem("talentlens_access_token");
    window.localStorage.removeItem("talentlens_refresh_token");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:inline">TalentLens</span>
            </button>
          </div>

          {/* Desktop Navigation - Removed, moved to vertical sidebar */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Navigation items removed - moved to vertical sidebar */}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="hidden sm:flex items-center gap-3 border-l border-slate-700 pl-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">Hiring Manager</p>
              </div>
              <button
                onClick={() => router.push("/settings")}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                title="Settings"
              >
                {user?.name?.[0] || "H"}
              </button>
            </div>

            <button
              onClick={() => router.push("/settings")}
              className="hidden sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* Logout Button Desktop */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Only show settings and logout */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 border-t border-slate-800 pt-4">
            <div className="border-t border-slate-800 pt-3 mt-3 space-y-2">
              <button
                onClick={() => {
                  router.push("/settings");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/30"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/30"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
