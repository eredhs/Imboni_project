"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Bell, Sliders, LinkIcon, Users, CreditCard } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "profile", label: "Profile", icon: User, href: "/recruiter/settings" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/recruiter/settings/notifications" },
    { id: "scoring", label: "Scoring Weights", icon: Sliders, href: "/recruiter/settings/scoring-weights" },
    { id: "team", label: "Team Members", icon: Users, href: "/recruiter/settings/team-members" },
    { id: "integrations", label: "Integrations", icon: LinkIcon, href: "/recruiter/settings/integrations" },
    { id: "billing", label: "Billing", icon: CreditCard, href: "/recruiter/settings/billing" },
  ];

  const getCurrentTab = () => {
    if (pathname.endsWith("/notifications")) return "notifications";
    if (pathname.includes("scoring-weights")) return "scoring";
    if (pathname.includes("team-members")) return "team";
    if (pathname.includes("integrations")) return "integrations";
    if (pathname.includes("billing")) return "billing";
    return "profile";
  };

  const currentTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-6 mb-0">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 sticky top-6 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
