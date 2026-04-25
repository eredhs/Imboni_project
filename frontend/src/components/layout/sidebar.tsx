"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Cpu, 
  Star, 
  BarChart2, 
  Settings, 
  LogOut 
} from "lucide-react";
import ImboniLogo from "../auth/ImboniLogo";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Applicants", href: "/applicants", icon: Users },
  { label: "AI Screening", href: "/screening", icon: Cpu },
  { label: "Shortlist", href: "/shortlist", icon: Star },
  { label: "Reports", href: "/reports", icon: BarChart2 },
];

const SYSTEM_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("talentlens_access_token");
    localStorage.removeItem("talentlens_user");
    router.push("/auth");
  };

  const NavItem = ({ item, isDanger = false }: { item: typeof NAV_ITEMS[0] | typeof SYSTEM_ITEMS[0], isDanger?: boolean }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg transition-colors duration-150 select-none group ${
          isActive 
            ? "bg-[#312E81] text-white" 
            : isDanger 
              ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
              : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
        }`}
      >
        <item.icon size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-[#0F172A] flex flex-col z-40">
      {/* LOGO ROW */}
      <div className="h-16 px-6 flex items-center border-b border-white/5">
        <ImboniLogo size="sm" showTagline={false} inline />
      </div>

      {/* RECRUITMENT SECTION */}
      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-6 mb-2 font-bold">
          Recruitment
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      <div className="flex-1" />

      {/* SYSTEM SECTION */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-6 mb-2 font-bold">
          System
        </p>
        <nav className="space-y-1">
          {SYSTEM_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
          <button
            onClick={handleSignOut}
            className="w-[calc(100%-1.5rem)] flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg transition-colors duration-150 text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}