"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ApplicationRow from "@/components/seeker/application-row";
import ApplicationDetailsModal from "@/components/seeker/application-details-modal";
import { useAuth } from "@/lib/auth-context";
import type { Application as ApiApplication, ApplicationEvent } from "@/lib/api-types";
import type { Application, ApplicationTimeline } from "@/lib/application-tracker-types";
import { useGetApplicationsByUserQuery } from "@/store/api/applications-api";

type StatusTab = "all" | "under_review" | "results_out" | "not_successful" | "accepted";

export default function ApplicationTrackerShell() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [sortBy, setSortBy] = useState<"recent" | "status" | "company">("recent");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, isLoading, isError } = useGetApplicationsByUserQuery(user?.id ?? "", {
    skip: !user?.id,
  });

  const applications = useMemo(
    () => (data?.data ?? []).map(mapApiApplicationToTrackerApplication),
    [data?.data],
  );

  const metrics = useMemo(() => {
    const totalApplied = applications.length;
    const underReview = applications.filter((app) => app.status === "under_review" || app.status === "shortlisted").length;
    const resultsOut = applications.filter((app) => app.status !== "under_review" && app.status !== "shortlisted").length;
    const successful = applications.filter((app) => app.status === "accepted" || app.status === "offer_extended").length;
    const notSuccessful = applications.filter((app) => app.status === "rejected").length;
    const appliedThisWeek = applications.filter((app) => {
      const diff = Date.now() - app.appliedDate.getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    const successRate = totalApplied ? Math.round((successful / totalApplied) * 100) : 0;

    return {
      totalApplied,
      underReview,
      resultsOut,
      successful,
      notSuccessful,
      successRate,
      appliedThisWeek,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const apps = applications.filter((application) => {
      if (activeTab === "all") return true;
      if (activeTab === "under_review") {
        return application.status === "under_review" || application.status === "shortlisted";
      }
      if (activeTab === "results_out") {
        return application.status === "accepted" || application.status === "offer_extended" || application.status === "rejected";
      }
      if (activeTab === "not_successful") {
        return application.status === "rejected";
      }
      return application.status === "accepted" || application.status === "offer_extended";
    });

    return [...apps].sort((a, b) => {
      if (sortBy === "recent") {
        return b.appliedDate.getTime() - a.appliedDate.getTime();
      }
      if (sortBy === "status") {
        return a.currentStage.localeCompare(b.currentStage);
      }
      return a.companyName.localeCompare(b.companyName);
    });
  }, [activeTab, applications, sortBy]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  const tabs = [
    { id: "all", label: "All", count: metrics.totalApplied },
    { id: "under_review", label: "Under Review", count: metrics.underReview },
    { id: "results_out", label: "Results Out", count: metrics.resultsOut },
    { id: "not_successful", label: "Not Successful", count: metrics.notSuccessful },
    { id: "accepted", label: "Accepted", count: metrics.successful },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Application Tracker</h1>
          <p className="text-slate-400">Track all your job applications and stay updated on their progress</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-5">
          <MetricCard label="Total Applied" value={metrics.totalApplied} note={`${metrics.appliedThisWeek} this week`} tone="slate" />
          <MetricCard label="Under Review" value={metrics.underReview} note="Pending decision" tone="yellow" />
          <MetricCard label="Results Out" value={metrics.resultsOut} note="Decision received" tone="blue" />
          <MetricCard label="Not Successful" value={metrics.notSuccessful} note="Keep trying!" tone="red" />
          <MetricCard label="Success Rate" value={`${metrics.successRate}%`} note="Keep applying!" tone="green" />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StatusTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-400">
            Showing {paginatedApplications.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length}
          </p>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "recent" | "status" | "company")}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 pr-10 text-slate-300 transition-colors focus:border-purple-500 focus:outline-none"
            >
              <option value="recent">Sort by: Most Recent</option>
              <option value="status">Sort by: Status</option>
              <option value="company">Sort by: Company</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {isLoading ? (
            <EmptyPanel title="Loading applications..." subtitle="Fetching your latest application updates." />
          ) : isError ? (
            <EmptyPanel title="Applications unavailable" subtitle="We could not load your applications right now." />
          ) : paginatedApplications.length > 0 ? (
            paginatedApplications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onViewDetails={() => setSelectedApplication(application)}
              />
            ))
          ) : (
            <EmptyPanel title="No applications found in this category." subtitle="Apply to jobs and they will appear here." />
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}

        <div className="mt-12 rounded-lg border border-purple-700/50 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6">
          <h3 className="mb-2 font-semibold text-purple-300">Application updates</h3>
          <p className="text-slate-300">
            When HR finishes screening and your profile is selected, you will now see a shortlist update here and in your notifications.
          </p>
        </div>
      </div>

      {selectedApplication ? (
        <ApplicationDetailsModal application={selectedApplication} onClose={() => setSelectedApplication(null)} />
      ) : null}
    </div>
  );
}

function mapApiApplicationToTrackerApplication(application: ApiApplication): Application {
  const appliedDate = new Date(application.appliedAt);
  const latestTimestamp = new Date(application.updatedAt);
  const timeline = [...application.timeline]
    .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime())
    .map(mapTimelineEvent);
  const daysInProcess = Math.max(
    0,
    Math.ceil((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const currentStage = getCurrentStage(application);
  const successRate = getSuccessRate(application);

  return {
    id: application.id,
    jobId: application.jobId,
    jobTitle: getApplicationLabel(application, "jobTitle"),
    companyName: getApplicationLabel(application, "companyName"),
    companyAvatar: getCompanyAvatar(getApplicationLabel(application, "companyName")),
    location: getApplicationLabel(application, "location"),
    jobType: "Full-time",
    appliedDate,
    status: mapApplicationOutcome(application),
    currentStage,
    timeline,
    successRate,
    daysInProcess,
    nextAction: application.status === "interview_scheduled" && application.interviewScheduledAt
      ? {
          type: "interview",
          dueDate: new Date(application.interviewScheduledAt),
          text: `Prepare for your interview on ${new Date(application.interviewScheduledAt).toLocaleString()}.`,
        }
      : undefined,
    contactPerson: undefined,
    salary: application.offerDetails
      ? {
          min: application.offerDetails.salary,
          max: application.offerDetails.salary,
          currency: "RWF",
        }
      : undefined,
  };
}

function mapTimelineEvent(event: ApplicationEvent): ApplicationTimeline {
  return {
    id: event.id,
    action: mapTimelineAction(event.type),
    message: event.message,
    timestamp: new Date(event.timestamp),
    icon: iconForTimelineEvent(event.type),
  };
}

function mapTimelineAction(type: ApplicationEvent["type"]): ApplicationTimeline["action"] {
  if (type === "applied") return "submitted";
  if (type === "screening_completed") return "screening_completed";
  if (type === "shortlisted") return "shortlisted";
  if (type === "interview_scheduled") return "interview_scheduled";
  if (type === "rejected") return "rejected";
  if (type === "accepted") return "accepted";
  if (type === "offer_made") return "offer_received";
  return "viewed";
}

function iconForTimelineEvent(type: ApplicationEvent["type"]) {
  if (type === "applied") return "📨";
  if (type === "screening_completed") return "🤖";
  if (type === "shortlisted") return "⭐";
  if (type === "interview_scheduled") return "📅";
  if (type === "offer_made") return "💼";
  if (type === "accepted") return "🎉";
  if (type === "rejected") return "✕";
  return "•";
}

function mapApplicationOutcome(application: ApiApplication): Application["status"] {
  if (application.status === "rejected") return "rejected";
  if (application.status === "accepted") return "accepted";
  if (application.status === "offer_extended") return "offer_extended";
  if (application.timeline.some((event) => event.type === "shortlisted")) return "shortlisted";
  return "under_review";
}

function getCurrentStage(application: ApiApplication) {
  if (application.status === "rejected") return "Not Selected";
  if (application.status === "accepted") return "Offer Accepted";
  if (application.status === "offer_extended") return "Offer Extended";
  if (application.status === "interview_scheduled") return "Interview Scheduled";
  if (application.timeline.some((event) => event.type === "shortlisted")) return "Shortlisted After Screening";
  if (application.screeningStatus === "completed") return "AI Screening Completed";
  return "Under Review";
}

function getSuccessRate(application: ApiApplication) {
  if (application.status === "accepted") return 100;
  if (application.status === "offer_extended") return 95;
  if (application.status === "interview_scheduled") return 80;
  if (application.timeline.some((event) => event.type === "shortlisted")) return 70;
  if (application.status === "rejected") return 0;
  if (typeof application.screeningScore === "number") return Math.max(20, Math.min(90, application.screeningScore));
  return 45;
}

function getApplicationLabel(application: ApiApplication, key: "jobTitle" | "companyName" | "location") {
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

function getCompanyAvatar(name: string) {
  return name.trim().charAt(0).toUpperCase() || "J";
}

function MetricCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: number | string;
  note: string;
  tone: "slate" | "yellow" | "blue" | "red" | "green";
}) {
  const toneClass =
    tone === "yellow"
      ? "from-yellow-900/30 to-yellow-900/10 border-yellow-700/50 text-yellow-400"
      : tone === "blue"
        ? "from-blue-900/30 to-blue-900/10 border-blue-700/50 text-blue-400"
        : tone === "red"
          ? "from-red-900/30 to-red-900/10 border-red-700/50 text-red-400"
          : tone === "green"
            ? "from-emerald-900/30 to-emerald-900/10 border-emerald-700/50 text-emerald-400"
            : "from-slate-800 to-slate-800/50 border-slate-700 text-white";

  return (
    <div className={`rounded-lg border bg-gradient-to-br p-4 ${toneClass}`}>
      <p className="mb-1 text-sm font-medium text-slate-400">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}

function EmptyPanel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
      <p className="text-lg text-slate-400">{title}</p>
      <p className="mt-2 text-slate-500">{subtitle}</p>
    </div>
  );
}
