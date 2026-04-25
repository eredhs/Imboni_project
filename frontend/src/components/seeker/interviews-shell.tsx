"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock3,
  Users,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Application } from "@/lib/api-types";
import { useGetApplicationsByUserQuery } from "@/store/api/applications-api";

type StatusTab = "all" | "scheduled" | "shortlisted" | "completed";

export default function InterviewsShell() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, isLoading, isError } = useGetApplicationsByUserQuery(user?.id ?? "", {
    skip: !user?.id,
  });

  const interviewFlowApplications = useMemo(() => {
    const applications = data?.data ?? [];
    return applications
      .filter(
        (application) =>
          application.status === "interview_scheduled" ||
          application.status === "offer_extended" ||
          application.status === "accepted" ||
          application.status === "rejected" ||
          application.timeline.some(
            (event) =>
              event.type === "shortlisted" || event.type === "interview_scheduled",
          ),
      )
      .sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
  }, [data?.data]);

  const metrics = useMemo(() => {
    const scheduled = interviewFlowApplications.filter(
      (application) => application.status === "interview_scheduled",
    ).length;
    const shortlisted = interviewFlowApplications.filter((application) =>
      application.timeline.some((event) => event.type === "shortlisted"),
    ).length;
    const completed = interviewFlowApplications.filter(
      (application) =>
        application.status === "offer_extended" ||
        application.status === "accepted" ||
        application.status === "rejected",
    ).length;

    return {
      total: interviewFlowApplications.length,
      scheduled,
      shortlisted,
      completed,
    };
  }, [interviewFlowApplications]);

  const filteredApplications = useMemo(() => {
    if (activeTab === "all") {
      return interviewFlowApplications;
    }

    if (activeTab === "scheduled") {
      return interviewFlowApplications.filter(
        (application) => application.status === "interview_scheduled",
      );
    }

    if (activeTab === "shortlisted") {
      return interviewFlowApplications.filter((application) =>
        application.timeline.some((event) => event.type === "shortlisted"),
      );
    }

    return interviewFlowApplications.filter(
      (application) =>
        application.status === "offer_extended" ||
        application.status === "accepted" ||
        application.status === "rejected",
    );
  }, [activeTab, interviewFlowApplications]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const tabs = [
    { id: "all", label: "All", count: metrics.total },
    { id: "scheduled", label: "Scheduled", count: metrics.scheduled },
    { id: "shortlisted", label: "Shortlisted", count: metrics.shortlisted },
    { id: "completed", label: "Completed", count: metrics.completed },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Interview Progress</h1>
          <p className="text-slate-400">
            Track your real shortlist, interview, and final-stage application updates.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <MetricCard
            title="Tracked Items"
            value={metrics.total}
            note="Shortlist and interview flow"
            tone="slate"
          />
          <MetricCard
            title="Scheduled"
            value={metrics.scheduled}
            note="Interview stage"
            tone="blue"
          />
          <MetricCard
            title="Shortlisted"
            value={metrics.shortlisted}
            note="Passed AI screening"
            tone="emerald"
          />
          <MetricCard
            title="Completed"
            value={metrics.completed}
            note="Final decision received"
            tone="purple"
          />
        </div>

        {metrics.scheduled > 0 ? (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-700/50 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-4">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="font-semibold text-blue-300">
                You have {metrics.scheduled} scheduled interview
                {metrics.scheduled === 1 ? "" : "s"}.
              </p>
              <p className="mt-1 text-sm text-blue-200/70">
                Open your applications tracker too for the latest recruiter notes and
                status changes.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-4 py-2 font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/40"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                {tab.label}
                {tab.count > 0 ? (
                  <span className="ml-2 rounded-full bg-slate-600/50 px-2 py-0.5 text-xs font-semibold">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <EmptyPanel title="Loading interview progress..." subtitle="Fetching live application milestones." />
          ) : isError ? (
            <EmptyPanel
              title="Interview progress unavailable"
              subtitle="We could not load your shortlist and interview updates right now."
            />
          ) : paginatedApplications.length > 0 ? (
            paginatedApplications.map((application) => {
              const latestEvent = getLatestEvent(application);
              const interviewDate = application.interviewScheduledAt
                ? new Date(application.interviewScheduledAt)
                : null;

              return (
                <div
                  key={application.id}
                  className="rounded-lg border border-slate-700 bg-slate-800/50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-white">
                          {getApplicationLabel(application, "jobTitle")}
                        </p>
                        <StatusBadge application={application} />
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {getApplicationLabel(application, "companyName")} ·{" "}
                        {getApplicationLabel(application, "location")}
                      </p>

                      <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                        <InfoRow
                          icon={<Users className="h-4 w-4 text-purple-300" />}
                          text={latestEvent?.message ?? "Application is progressing through review."}
                        />
                        <InfoRow
                          icon={<Clock3 className="h-4 w-4 text-purple-300" />}
                          text={`Updated ${new Date(application.updatedAt).toLocaleString()}`}
                        />
                        {interviewDate ? (
                          <InfoRow
                            icon={<Calendar className="h-4 w-4 text-purple-300" />}
                            text={`Interview scheduled for ${interviewDate.toLocaleString()}`}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyPanel
              title="No live interview updates yet"
              subtitle="Once you are shortlisted or scheduled for an interview, the update will appear here automatically."
            />
          )}
        </div>

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                type="button"
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-lg px-3 py-2 font-medium transition-all ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/40"
                    : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getLatestEvent(application: Application) {
  return [...application.timeline].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )[0];
}

function getApplicationLabel(
  application: Application,
  key: "jobTitle" | "companyName" | "location",
) {
  const details = application.timeline
    .flatMap((event) => [event.details])
    .find((detail) => detail && typeof detail[key] === "string");

  if (details && typeof details[key] === "string") {
    return details[key] as string;
  }

  if (key === "jobTitle") {
    return `Job ${application.jobId}`;
  }

  if (key === "companyName") {
    return "Hiring Team";
  }

  return "Location not specified";
}

function StatusBadge({ application }: { application: Application }) {
  if (application.status === "interview_scheduled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
        <Calendar className="h-3.5 w-3.5" />
        Scheduled
      </span>
    );
  }

  if (application.status === "offer_extended" || application.status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
        <CheckCircle className="h-3.5 w-3.5" />
        Advanced
      </span>
    );
  }

  if (application.status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300">
        <XCircle className="h-3.5 w-3.5" />
        Closed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
      <Users className="h-3.5 w-3.5" />
      Shortlisted
    </span>
  );
}

function MetricCard({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: number;
  note: string;
  tone: "slate" | "blue" | "emerald" | "purple";
}) {
  const toneClass =
    tone === "blue"
      ? "from-blue-900/30 to-blue-900/10 border-blue-700/50 text-blue-400"
      : tone === "emerald"
        ? "from-emerald-900/30 to-emerald-900/10 border-emerald-700/50 text-emerald-400"
        : tone === "purple"
          ? "from-purple-900/30 to-purple-900/10 border-purple-700/50 text-purple-400"
          : "from-slate-800 to-slate-800/50 border-slate-700 text-white";

  return (
    <div className={`rounded-lg border bg-gradient-to-br p-4 ${toneClass}`}>
      <p className="mb-1 text-sm font-medium text-slate-400">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function EmptyPanel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
      <p className="text-lg text-slate-300">{title}</p>
      <p className="mt-2 text-slate-500">{subtitle}</p>
    </div>
  );
}
