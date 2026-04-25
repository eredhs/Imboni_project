"use client";

import { useState } from "react";
import { Briefcase, FileText, CheckCircle2, Clock, TrendingUp, ArrowRight, Eye, Zap, Users, AlertCircle } from "lucide-react";
import { useGetDashboardQuery, useGetActivitiesQuery } from "@/store/api/moderation-api";

export default function ModerationDashboard() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetDashboardQuery();
  const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError } = useGetActivitiesQuery();

  const stats = dashboardData?.stats;
  const activities = activitiesData?.data || [];
  const loading = dashboardLoading || activitiesLoading;
  const error = dashboardError || activitiesError;

  const getActivityBadgeConfig = (type: string) => {
    switch (type) {
      case "job_posted":
        return {
          icon: Briefcase,
          label: "Job Posted",
          bgColor: "bg-blue-900/30",
          borderColor: "border-blue-700/50",
          textColor: "text-blue-300",
          badgeBg: "bg-blue-600/20",
          badgeBorder: "border-blue-600/40",
          dotColor: "bg-blue-400",
        };
      case "application_received":
        return {
          icon: FileText,
          label: "Application",
          bgColor: "bg-purple-900/30",
          borderColor: "border-purple-700/50",
          textColor: "text-purple-300",
          badgeBg: "bg-purple-600/20",
          badgeBorder: "border-purple-600/40",
          dotColor: "bg-purple-400",
        };
      case "placement":
        return {
          icon: CheckCircle2,
          label: "Placement",
          bgColor: "bg-emerald-900/30",
          borderColor: "border-emerald-700/50",
          textColor: "text-emerald-300",
          badgeBg: "bg-emerald-600/20",
          badgeBorder: "border-emerald-600/40",
          dotColor: "bg-emerald-400",
        };
      default:
        return {
          icon: Clock,
          label: "Activity",
          bgColor: "bg-slate-700/30",
          borderColor: "border-slate-600",
          textColor: "text-slate-300",
          badgeBg: "bg-slate-600/20",
          badgeBorder: "border-slate-600/40",
          dotColor: "bg-slate-400",
        };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-indigo-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400">Loading moderation dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
            <h2 className="text-red-400 font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-300/80">Failed to load moderation data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Moderation Dashboard</h1>
          <p className="text-slate-400">Monitor platform activity and job postings</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Jobs</p>
              <p className="text-4xl font-bold text-white">{stats.totalJobs}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Active Jobs</p>
              <p className="text-4xl font-bold text-emerald-400">{stats.activeJobs}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Draft Jobs</p>
              <p className="text-4xl font-bold text-yellow-400">{stats.draftJobs}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-600/20 border border-slate-500/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-slate-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Closed Jobs</p>
              <p className="text-4xl font-bold text-slate-300">{stats.closedJobs}</p>
            </div>
          </div>
        )}

        {/* Recent Activities - Professional Timeline */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              Recent Activities
            </h2>
            <p className="text-slate-400 text-sm">Monitor all platform events in real-time</p>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const config = getActivityBadgeConfig(activity.type);
              const Icon = config.icon;
              const isSelected = selectedActivity === activity.id;

              return (
                <div key={activity.id}>
                  {/* Timeline connector line */}
                  {idx < activities.length - 1 && (
                    <div className="absolute left-10 top-20 w-1 h-12 bg-gradient-to-b from-slate-600 to-transparent"></div>
                  )}

                  <div
                    onClick={() => setSelectedActivity(isSelected ? null : activity.id)}
                    className={`relative group cursor-pointer rounded-lg border transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? `${config.bgColor} ${config.borderColor} ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20`
                        : `bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50`
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-5">
                        {/* Animated Icon Badge */}
                        <div className="flex-shrink-0 relative">
                          <div className={`w-16 h-16 rounded-xl ${config.badgeBg} border-2 ${config.badgeBorder} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`} style={{boxShadow: isSelected ? `0 0 20px ${config.dotColor}40` : 'none'}}>
                            <Icon className={`w-9 h-9 ${config.textColor}`} />
                          </div>
                          {/* Pulsing indicator dot */}
                          <div className={`absolute -top-2 -right-2 w-4 h-4 ${config.dotColor} rounded-full animate-pulse border-2 border-slate-900`}></div>
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{activity.title}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${config.badgeBg} ${config.textColor} border ${config.badgeBorder}`}>
                                  <div className={`w-2 h-2 ${config.dotColor} rounded-full`}></div>
                                  {config.label}
                                </span>
                                <span className="text-slate-500 text-xs">
                                  {formatTime(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-300 text-sm leading-relaxed mb-3">{activity.description}</p>

                          {/* Activity Meta */}
                          <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-700/50">
                            {activity.user && (
                              <div className="flex items-center gap-2">
                                <Users size={14} className={config.textColor} />
                                <span className="text-slate-400 font-medium">{activity.user}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{new Date(activity.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Button */}
                        <div className="flex-shrink-0">
                          <button
                            className={`p-3 rounded-lg transition-all duration-300 ${
                              isSelected
                                ? `bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-700`
                                : `bg-slate-700/50 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200`
                            }`}
                            title="View details"
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details Section */}
                      {isSelected && (
                        <div className="mt-5 pt-5 border-t border-slate-700 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
                              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">Event Type</p>
                              <p className={`text-lg font-bold ${config.textColor}`}>{config.label}</p>
                            </div>
                            <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
                              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">Timestamp</p>
                              <p className="text-white font-semibold text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
                              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">Relative Time</p>
                              <p className="text-white font-semibold text-sm">{formatTime(activity.timestamp)}</p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">Full Details</p>
                            <p className="text-slate-200 text-sm leading-relaxed">{activity.description}</p>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 group">
                              <Eye size={18} className="group-hover:-translate-x-1 transition-transform" />
                              View Full Details
                            </button>
                            <button className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2 group">
                              <Zap size={18} className="group-hover:scale-110 transition-transform" />
                              Take Action
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gradient overlay for hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}></div>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {activities.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">No activities recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
