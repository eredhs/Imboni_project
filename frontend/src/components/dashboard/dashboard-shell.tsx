"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  MoreHorizontal,
  Cpu,
  ArrowRight,
  Loader2,
  ArrowUpRight,
  ChevronRight,
  Bot,
} from "lucide-react";
import { useGetDashboardOverviewQuery } from "@/store/api/dashboard-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { useCountUp } from "@/hooks/useCountUp";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";

export function DashboardShell() {
  const { data, isLoading, isError, refetch } = useGetDashboardOverviewQuery() as any;
  const welcomeName = data?.recentScreenings?.[0] ? "Sarah" : "Sarah Miller";
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);

  return (
    <section className="animate-fade-in-up px-8 py-6 relative">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Good morning, {welcomeName}. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/jobs" className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors">
            Manage Jobs
          </Link>
          <Link href="/screening" className="bg-[#312E81] hover:bg-[#4338CA] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-sm">
            Start New Screening
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingState key={index} lines={3} />
            ))}
          </div>
          <div className="grid gap-6 grid-cols-[2fr_1fr]">
            <LoadingState lines={6} />
            <LoadingState lines={5} />
          </div>
        </div>
      ) : null}

      {isError ? (
        <div>
          <ErrorState
            title="Dashboard failed to load"
            description="We could not fetch your dashboard overview. Try the request again."
            action={<RetryButton onClick={() => void refetch()} />}
          />
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        <>
          {/* STAT CARDS */}
          <div className="grid gap-4 grid-cols-4 mb-6">
            <StatCard
              icon={<Briefcase size={22} />}
              label="Active Jobs"
              value={data.activeJobs}
              subtitle="2 closing this week"
              trend="+12%"
            />
            <StatCard
              icon={<Cpu size={22} />}
              label="Pending Screenings"
              value={data.pendingScreenings}
              subtitle="Waiting for AI review"
              trend=""
            />
            <StatCard
              icon={<Users size={22} />}
              label="Shortlisted Today"
              value={data.shortlistedToday}
              subtitle="Recommended by IMBONI"
              trend=""
            />
            <StatCard
              icon={<Clock size={22} />}
              label="Time Saved"
              value={`${data.timeSavedHours.toFixed(1)}`}
              subtitle="This billing period"
              isMoney
              trend="+12%"
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="grid gap-6 grid-cols-5">
            {/* Recent Screenings */}
            <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent AI Screenings</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Track the latest automated candidate evaluations</p>
                </div>
              <Link href="/reports" className="text-sm font-medium text-[#312E81] hover:underline flex items-center gap-1">
                View All Screenings <ArrowRight size={15} />
                </Link>
              </div>

              {data.recentScreenings.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No screenings yet" description="Start your first screening to see results here" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-3 text-left">Job Title</th>
                        <th className="px-6 py-3 text-left">Applicants</th>
                        <th className="px-6 py-3 text-left">Top Score</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentScreenings.map((item: any, index: number) => (
                        <tr
                          key={`${item.id}-${item.topScore}-${index}`}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">{item.jobTitle}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <Users size={14} className="text-gray-400" />
                              {item.applicants}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#10B981]">{item.topScore}%</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-6 py-4">
                            {item.status === "completed" ? (
                              <button className="text-[#312E81] text-sm font-semibold hover:underline">View →</button>
                            ) : (
                              <button className="text-gray-500 text-sm font-medium hover:text-gray-900">Details</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="col-span-2 space-y-6">
              {/* Pool Intelligence */}
              <div className="bg-[#312E81] text-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={16} className="text-white/60" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                    Intelligence AI
                  </p>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">IMBONI Intelligence</h2>
                <div className="bg-white/10 rounded-lg p-4 text-sm leading-relaxed">
                  <p className="text-white">
                    "We've detected a <span className="font-semibold">strength</span> in high-quality{" "}
                    <span className="font-semibold text-white">DevOps profiles</span> matching your Senior role. Most candidates exhibit strong <span className="font-semibold text-white">
                      Kubernetes expertise
                    </span>."
                  </p>
                </div>

            <p className="text-[10px] uppercase tracking-[0.15em] text-white/60 mt-5 mb-2 font-bold">Trending Skills in Your Pool</p>
                <div className="flex flex-wrap gap-2">
                  {["React.js", "Go", "AWS Lambda"].map((skill) => (
                    <span key={skill} className="bg-white/20 text-white text-[10px] font-bold rounded-full px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 bg-white/10 rounded-lg p-3 border border-white/5">
                  <div className="flex items-start gap-2">
                    <ArrowUpRight size={14} className="text-emerald-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-white">Insight Alert</p>
                      <p className="text-[11px] text-white/80 mt-0.5">
                        Average candidates score for "Frontend" has increased by 8 pts this week.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-black/30 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-between px-4 hover:bg-black/40 transition-colors">
                  <p>Need more candidates?</p>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Top Match Candidate */}
              {data?.topMatchCandidate && (
                <article 
                  onClick={() => setDrawerCandidateId(data?.topMatchCandidate?.id || null)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mt-4 cursor-pointer hover:border-[#312E81] transition-colors group"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Top Match Candidate</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#312E81] font-bold text-xs">
                      {getInitials(data?.topMatchCandidate?.name || "C")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#312E81] transition-colors">{data?.topMatchCandidate?.name}</p>
                      <p className="text-[11px] text-gray-400">{data?.topMatchCandidate?.matchScore}% Match · {data?.topMatchCandidate?.role}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#312E81] transition-colors" />
                  </div>
                </article>
              )}
            </div>
          </div>
        </>
      ) : null}

      <CandidateDrawer 
        candidateId={drawerCandidateId} 
        open={!!drawerCandidateId} 
        onClose={() => setDrawerCandidateId(null)} 
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  isMoney,
  trend,
}: {
  icon: React.ReactNode; label: string; value: number | string; subtitle: string; isMoney?: boolean; trend?: string;
}) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value));
  const count = useCountUp(numericValue, 1200);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-count-up">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#312E81]">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {count}{isMoney ? " hrs" : ""}
      </p>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "completed" | "in_progress" | "pending" }) {
  if (status === "completed") {
    return <span className="inline-flex rounded-full bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
      Completed
    </span>;
  }
  if (status === "in_progress") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] text-[#312E81] text-xs font-semibold px-3 py-1">
      <Loader2 size={12} className="animate-spin" />
      In Progress
    </span>;
  }
  return <span className="inline-flex rounded-full bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1">
    Pending
  </span>;
}

function highlightSkills(text: string, skills: string[]) {
  return text.split(new RegExp(`(${skills.join("|")})`, "gi")).map((part, index) => {
    const match = skills.some((skill) => skill.toLowerCase() === part.toLowerCase());
    return match ? (
      <span key={`${part}-${index}`} className="font-semibold text-imboni-primary">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
