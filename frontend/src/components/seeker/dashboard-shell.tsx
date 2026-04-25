"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { Bell, Briefcase, Calendar, FileText, Home, LogOut, Menu, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import ImboniLogo from "../auth/ImboniLogo";
import { useAuth } from "@/lib/auth-context";
import { useGetApplicationsByUserQuery, useGetNotificationsQuery } from "@/store/api/applications-api";
import { useGetSeekerJobsQuery } from "@/store/api/jobs-api";

export function JobSeekerDashboardShell() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const userId = user?.id ?? "";
  const { data: jobsData, isLoading: jobsLoading } = useGetSeekerJobsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { data: applicationsData, isLoading: applicationsLoading } = useGetApplicationsByUserQuery(userId, {
    skip: !userId,
  });
  const { data: notificationsData } = useGetNotificationsQuery(userId, {
    skip: !userId,
  });

  const applications = applicationsData?.data ?? [];
  const recommendedJobs = (jobsData?.items ?? []).slice(0, 4);
  const metrics = useMemo(
    () => ({
      totalApplications: applications.length,
      underReview: applications.filter((application) =>
        application.status === "under_review" || application.timeline.some((event) => event.type === "shortlisted"),
      ).length,
      interviews: applications.filter((application) => application.status === "interview_scheduled").length,
      unreadNotifications: notificationsData?.unreadCount ?? 0,
    }),
    [applications, notificationsData?.unreadCount],
  );

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem("talentlens_user");
    window.localStorage.removeItem("talentlens_access_token");
    window.localStorage.removeItem("talentlens_refresh_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 hover:bg-[#F3F4F6] md:hidden">
              <Menu className="h-5 w-5 text-[#6B7280]" />
            </button>
            <button onClick={() => router.push("/seeker/dashboard")} className="flex items-center gap-2">
              <ImboniLogo size="sm" showTagline={false} inline />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/seeker/notifications" className="relative rounded-lg p-2 hover:bg-[#F3F4F6]">
              <Bell className="h-5 w-5 text-[#6B7280]" />
              {metrics.unreadNotifications > 0 ? (
                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#10B981] px-1 text-[10px] font-bold text-white">
                  {metrics.unreadNotifications}
                </span>
              ) : null}
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#111827]">{user?.name ?? "Job Seeker"}</p>
              <button onClick={() => router.push("/seeker/profile")} className="text-xs text-[#6B7280] hover:text-[#111827]">
                View profile
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-[#111827]">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}.
            <Sun size={28} className="text-amber-400" />
          </h1>
          <p className="text-[#6B7280]">
            Track your real applications, shortlist progress, and new openings from the live system.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <MetricCard label="Applications Sent" value={metrics.totalApplications} note="Live application records" />
          <MetricCard label="Under Review" value={metrics.underReview} note="Includes shortlisted applications" />
          <MetricCard label="Interviews" value={metrics.interviews} note="Scheduled interview stage" />
          <MetricCard label="Unread Alerts" value={metrics.unreadNotifications} note="Notifications awaiting review" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Recommended Open Jobs</h2>
              <Link href="/seeker/browse" className="font-semibold text-[#10B981] hover:text-[#059669]">
                Browse all jobs
              </Link>
            </div>

            <div className="space-y-4">
              {jobsLoading ? (
                <PanelMessage title="Loading live jobs..." body="Fetching current openings from the backend." />
              ) : recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/seeker/browse?jobId=${job.id}`}
                    className="block rounded-xl border border-[#E5E7EB] bg-white p-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827]">{job.title}</h3>
                        <p className="text-sm text-[#6B7280]">
                          {job.department} · {job.location}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                        <Briefcase size={20} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((skill) => (
                        <span key={skill} className="rounded bg-[#F3F4F6] px-2 py-1 text-xs text-[#6B7280]">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-[#10B981]">See details</span>
                    </div>
                  </Link>
                ))
              ) : (
                <PanelMessage title="No open jobs right now" body="When recruiters publish active jobs, they will appear here automatically." />
              )}
            </div>
          </section>

          <section className="space-y-6">
            <QuickLink href="/seeker/applications" icon={<FileText className="h-5 w-5" />} title="Applications" text="Open your live application tracker and shortlist updates." />
            <QuickLink href="/seeker/notifications" icon={<Bell className="h-5 w-5" />} title="Notifications" text="See screening, shortlist, and interview messages from recruiters." />
            <QuickLink href="/seeker/interviews" icon={<Calendar className="h-5 w-5" />} title="Interviews" text="Review upcoming interviews and interview-related stages." />
            <QuickLink href="/seeker/browse" icon={<Home className="h-5 w-5" />} title="Find Jobs" text="Search the live job catalog instead of mock listings." />
          </section>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-[#111827]">Latest Application Activity</h2>
          {applicationsLoading ? (
            <PanelMessage title="Loading applications..." body="Pulling your latest application events." />
          ) : applications.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
              {applications.slice(0, 5).map((application) => {
                const latestEvent = [...application.timeline].sort(
                  (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
                )[0];

                return (
                  <div key={application.id} className="border-b border-[#E5E7EB] px-5 py-4 last:border-b-0">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-[#111827]">Application {application.id}</p>
                        <p className="text-sm text-[#6B7280]">{latestEvent?.message ?? "Application submitted"}</p>
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        {new Date(application.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <PanelMessage title="No applications yet" body="Apply to a job from the live job board and your tracker will update here." />
          )}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
      <p className="mb-2 text-xs font-semibold uppercase text-[#9CA3AF]">{label}</p>
      <p className="mb-1 text-3xl font-bold text-[#111827]">{value}</p>
      <p className="text-xs text-[#6B7280]">{note}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="block rounded-xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#10B981]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#10B981]">
        {icon}
      </div>
      <p className="font-semibold text-[#111827]">{title}</p>
      <p className="mt-1 text-sm text-[#6B7280]">{text}</p>
    </Link>
  );
}

function PanelMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
      <p className="font-semibold text-[#111827]">{title}</p>
      <p className="mt-1 text-sm text-[#6B7280]">{body}</p>
    </div>
  );
}
