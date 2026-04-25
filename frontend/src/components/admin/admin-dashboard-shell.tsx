"use client";

import React, { useState, useMemo } from "react";
import {
  getAdminDashboardStats,
  mockCompanyApplications,
  getAllCompanyApplications,
} from "@/lib/mock-admin-data";
import AdminCompanyReviewModal from "@/components/admin/admin-company-review-modal";
import {
  Users,
  Building,
  Briefcase,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Zap,
  FileCheck,
  Award,
} from "lucide-react";
import type { CompanyApplication } from "@/lib/admin-types";
import { useGetAdminStatsQuery, useGetPlatformInsightsQuery } from "@/store/api/admin-api";

interface AdminStats {
  pending: number;
  approved: number;
}

export default function AdminDashboardShell() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyApplication | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "companies" | "users" | "jobs">("overview");
  const [companyFilter, setCompanyFilter] = useState<"all" | "pending" | "approved">("all");

  const stats = useMemo(() => getAdminDashboardStats(), []);
  const allCompanies = useMemo(() => getAllCompanyApplications(), []);

  // Real API data
  const { data: adminStats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: platformInsights, isLoading: insightsLoading } = useGetPlatformInsightsQuery();

  const companyStats: AdminStats = useMemo(() => {
    return {
      pending: mockCompanyApplications.length,
      approved: allCompanies.filter((c) => c.status === "approved").length,
    };
  }, [allCompanies]);

  const filteredCompanies = useMemo(() => {
    if (companyFilter === "pending") return mockCompanyApplications;
    if (companyFilter === "approved")
      return allCompanies.filter((c) => c.status === "approved");
    return allCompanies;
  }, [allCompanies, companyFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Super Admin Dashboard</h1>
          <p className="text-slate-400">Platform management and oversight</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-emerald-400 text-sm font-semibold">
                Up {stats.metrics.monthlyNewUsers} this month
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Users</p>
            <p className="text-4xl font-bold text-white">{stats.metrics.totalUsers.toLocaleString()}</p>
            <div className="mt-3 flex gap-3 text-xs text-slate-400">
              <span>{stats.metrics.totalJobSeekers} seekers</span>
              <span>{stats.metrics.totalRecruiters} recruiters</span>
            </div>
          </div>

          {/* Total Companies */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold">{companyStats.pending} pending</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Registered Companies</p>
            <p className="text-4xl font-bold text-white">{stats.metrics.totalCompanies}</p>
            <div className="mt-3 flex gap-2">
              <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-xs rounded font-semibold">
                {companyStats.approved} approved
              </span>
            </div>
          </div>

          {/* Total Jobs Posted */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-emerald-400 text-sm font-semibold">
                Up {stats.metrics.monthlyJobPostings} this month
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Jobs Posted</p>
            <p className="text-4xl font-bold text-white">{stats.metrics.totalJobsPosted}</p>
            <div className="mt-3 text-xs text-slate-400">
              {stats.metrics.activeApplications} active applications
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-600/20 border border-pink-500/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-pink-400" />
              </div>
              <span className="text-emerald-400 text-sm font-semibold">Good</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Platform Health</p>
            <p className="text-4xl font-bold text-white">{stats.metrics.platformHealth}%</p>
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                style={{ width: `${stats.metrics.platformHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 bg-slate-800/50 border border-slate-700 rounded-lg p-2 flex-wrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "companies"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Companies ({companyStats.pending})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "jobs"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Jobs & Applications
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "users" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Users
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {stats.recentActivity.map((activity, i) => {
                  // Map activity types to icons and colors
                  const activityConfig: Record<string, { icon: React.ReactNode; bgColor: string; borderColor: string; textColor: string; dotColor: string; label: string }> = {
                    company_signup: {
                      icon: <Building className="w-6 h-6" />,
                      bgColor: "bg-blue-600/20",
                      borderColor: "border-blue-600/40",
                      textColor: "text-blue-300",
                      dotColor: "bg-blue-400",
                      label: "Company"
                    },
                    job_posted: {
                      icon: <Briefcase className="w-6 h-6" />,
                      bgColor: "bg-emerald-600/20",
                      borderColor: "border-emerald-600/40",
                      textColor: "text-emerald-300",
                      dotColor: "bg-emerald-400",
                      label: "Job"
                    },
                    placement: {
                      icon: <Award className="w-6 h-6" />,
                      bgColor: "bg-purple-600/20",
                      borderColor: "border-purple-600/40",
                      textColor: "text-purple-300",
                      dotColor: "bg-purple-400",
                      label: "Placement"
                    },
                    application: {
                      icon: <FileCheck className="w-6 h-6" />,
                      bgColor: "bg-yellow-600/20",
                      borderColor: "border-yellow-600/40",
                      textColor: "text-yellow-300",
                      dotColor: "bg-yellow-400",
                      label: "Application"
                    },
                  };

                  const config = activityConfig[activity.type] || {
                    icon: <Activity className="w-6 h-6" />,
                    bgColor: "bg-slate-600/20",
                    borderColor: "border-slate-600/40",
                    textColor: "text-slate-300",
                    dotColor: "bg-slate-400",
                    label: "Activity"
                  };

                  return (
                    <div
                      key={i}
                      className={`group relative rounded-lg border transition-all p-4 overflow-hidden cursor-pointer hover:shadow-lg ${config.bgColor} ${config.borderColor} hover:shadow-slate-900/50`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon Badge */}
                        <div className={`relative flex-shrink-0 w-12 h-12 ${config.bgColor} border ${config.borderColor} rounded-lg flex items-center justify-center transition-all group-hover:scale-110 ${config.textColor}`}>
                          {config.icon}
                          <div className={`absolute -top-1 -right-1 w-3 h-3 ${config.dotColor} rounded-full animate-pulse border border-slate-900`}></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                              {config.label}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {activity.timestamp.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-200 font-medium text-sm leading-relaxed">{activity.description}</p>
                        </div>

                        {/* Quick Action */}
                        <div className="flex-shrink-0">
                          <button className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${config.bgColor} ${config.textColor}`}>
                            <Zap size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              {/* Successful Placements */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-700/50 rounded-lg p-6">
                <h4 className="text-emerald-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Successful Placements
                </h4>
                <p className="text-4xl font-bold text-emerald-400">{stats.metrics.successfulPlacements}</p>
                <p className="text-emerald-200/70 text-xs mt-2">Candidates successfully placed</p>
              </div>

              {/* Pending Approvals */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-lg p-6">
                <h4 className="text-yellow-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Approvals
                </h4>
                <p className="text-4xl font-bold text-yellow-400">
                  {stats.metrics.companyApplicationsPending}
                </p>
                <p className="text-yellow-200/70 text-xs mt-2">Companies awaiting review</p>
              </div>

              {/* Active Applications */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-lg p-6">
                <h4 className="text-blue-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Active Applications
                </h4>
                <p className="text-4xl font-bold text-blue-400">{stats.metrics.activeApplications}</p>
                <p className="text-blue-200/70 text-xs mt-2">Candidates in process</p>
              </div>
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
              {(["all", "pending", "approved"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCompanyFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    companyFilter === filter
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {filter === "all"
                    ? "All Companies"
                    : filter === "pending"
                      ? `Pending (${companyStats.pending})`
                      : `Approved (${companyStats.approved})`}
                </button>
              ))}
            </div>

            {/* Company List */}
            <div className="space-y-3">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedCompany(company);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="w-full bg-slate-800/50 border border-slate-700 hover:border-purple-600/50 rounded-lg p-5 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white">{company.companyName}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            company.status === "pending"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-emerald-900/50 text-emerald-300"
                          }`}
                        >
                          {company.status === "pending" ? "Pending" : "Approved"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {company.companyEmail}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {company.contactPhone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {company.industry}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {company.companySize} employees
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs mt-2">
                        Applied: {company.applicantDate.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompany(company);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold">{user.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.role === "job_seeker"
                          ? "bg-green-900/50 text-green-300"
                          : user.role === "recruiter"
                            ? "bg-purple-900/50 text-purple-300"
                            : "bg-blue-900/50 text-blue-300"
                      }`}
                    >
                      {user.role === "job_seeker"
                        ? "Job Seeker"
                        : user.role === "recruiter"
                          ? "Recruiter"
                          : "Admin"}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded text-xs font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div>Joined: {user.joinDate.toLocaleDateString()}</div>
                  </div>
                  {user.company && (
                    <p className="text-slate-500 text-xs mt-2">Company: {user.company}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-slate-400 text-sm">
                    Last active:{" "}
                    {user.lastActive.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs & Applications Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {statsLoading || insightsLoading ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                <p className="text-slate-400">Loading job statistics...</p>
              </div>
            ) : adminStats && platformInsights ? (
              <>
                {/* Platform Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-4">
                    <p className="text-blue-300 text-sm mb-2">Total Jobs</p>
                    <p className="text-3xl font-bold text-blue-400">{adminStats.platformStats.totalJobs}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-700/50 rounded-lg p-4">
                    <p className="text-emerald-300 text-sm mb-2">Active</p>
                    <p className="text-3xl font-bold text-emerald-400">{adminStats.platformStats.activeJobs}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm mb-2">Applications</p>
                    <p className="text-3xl font-bold text-purple-400">{adminStats.platformStats.totalApplications}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-lg p-4">
                    <p className="text-amber-300 text-sm mb-2">Avg Apps/Job</p>
                    <p className="text-3xl font-bold text-amber-400">{adminStats.platformStats.avgApplicationsPerJob}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4">
                    <p className="text-red-300 text-sm mb-2">Closing Soon</p>
                    <p className="text-3xl font-bold text-red-400">{platformInsights.insights.closingThisWeek}</p>
                  </div>
                </div>

                {/* Job Breakdown */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Job Breakdown by Department</h3>
                  <div className="space-y-3">
                    {adminStats.jobBreakdown.map((job) => (
                      <div key={job.jobId} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{job.title}</p>
                          <p className="text-sm text-slate-400">{job.department}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded text-sm font-semibold ${
                            job.status === "active" 
                              ? "bg-emerald-900/50 text-emerald-300" 
                              : "bg-slate-600/50 text-slate-300"
                          }`}>
                            {job.status}
                          </span>
                          <span className="text-2xl font-bold text-purple-400">{job.applications}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Jobs by Status</h3>
                    <div className="space-y-2">
                      {Object.entries(platformInsights.insights.jobsByStatus).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-slate-300 capitalize">{status}</span>
                          <span className="font-semibold text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Jobs by Department</h3>
                    <div className="space-y-2">
                      {Object.entries(platformInsights.insights.jobsByDepartment).map(([dept, count]) => (
                        <div key={dept} className="flex justify-between items-center">
                          <span className="text-slate-300">{dept}</span>
                          <span className="font-semibold text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Company Review Modal */}
      {selectedCompany && (
        <AdminCompanyReviewModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onApprove={(companyId) => {
            alert(`Company "${selectedCompany.companyName}" has been approved!`);
            setSelectedCompany(null);
          }}
          onReject={(companyId, reason) => {
            alert(`Company has been rejected. Notification sent to company.`);
            setSelectedCompany(null);
          }}
          onRequestChanges={(companyId, feedback) => {
            alert(`Company has been flagged for changes.`);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
}
