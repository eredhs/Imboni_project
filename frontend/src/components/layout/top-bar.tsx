"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-8">
      {/* LEFT: Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidates or jobs..."
          className="w-80 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#312E81]/10 focus:border-[#312E81] transition-all"
        />
      </div>

      {/* RIGHT: User & Notifications */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-full transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900">Sarah Miller</span>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Senior Recruiter</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] border border-[#312E81]/10 flex items-center justify-center text-[#312E81] font-bold text-sm">
            SM
          </div>
        </div>
      </div>
    </header>
  );
}