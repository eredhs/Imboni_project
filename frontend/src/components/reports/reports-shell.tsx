"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Clock, Download, Info, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { useGetReportsOverviewQuery } from "@/store/api/reports-api";

const outcomeColors = ["#10B981", "#EF4444", "#F59E0B"];

export function ReportsShell() {
  const { data, isLoading, isError, refetch } = useGetReportsOverviewQuery();
  const hasData = Boolean(data && data.kpis);
  const kpis = data?.kpis ?? {
    totalScreened: 0,
    totalScreenedDelta: 0,
    avgTimeSavedHours: 0,
    efficiencyGainPercent: 0,
    shortlistAcceptance: 0,
    shortlistDelta: 0,
  };
  const screeningsTimeline = Array.isArray(data?.screeningsTimeline)
    ? data?.screeningsTimeline
    : [];
  const skillsFrequency = Array.isArray(data?.skillsFrequency)
    ? data?.skillsFrequency
    : [];
  const outcomes = data?.outcomes ?? { hired: 0, rejected: 0, inProgress: 0 };
  const biasHistory = Array.isArray(data?.biasHistory) ? data?.biasHistory : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
            <p className="mt-2 text-sm text-slate-400">
              Monitor your recruitment performance and AI-driven efficiency gains.
            </p>
          </div>

          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            <Download className="h-4 w-4" strokeWidth={1.9} />
            <span>Export CSV</span>
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingState key={index} lines={3} />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <LoadingState lines={7} />
              <LoadingState lines={7} />
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
              <LoadingState lines={6} />
              <LoadingState lines={8} />
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8">
            <ErrorState
              title="Reports are unavailable"
              description="The analytics service could not be reached. Try the request again."
              action={<RetryButton onClick={() => void refetch()} />}
            />
          </div>
        ) : null}

        {!isLoading && !isError && !hasData ? (
          <div className="mt-8">
            <EmptyState
              title="No analytics yet"
              description="Screening activity will populate your reports once candidates have been processed."
            />
          </div>
        ) : null}

        {!isLoading && !isError && hasData ? (
          <>
            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              <KpiCard
                label="Total Screened"
                value={String(kpis.totalScreened)}
                trend={`+${kpis.totalScreenedDelta}% vs last month`}
                subtitle="Candidates this month"
                icon={Users}
              />
              <KpiCard
                label="Avg Time Saved"
                value={`${kpis.avgTimeSavedHours.toFixed(1)} hrs`}
                trend={`${kpis.efficiencyGainPercent}% efficiency gain`}
                subtitle="Per open position"
                icon={Clock}
              />
              <KpiCard
                label="Shortlist Acceptance"
                value={`${kpis.shortlistAcceptance}%`}
                trend={`+${kpis.shortlistDelta}% quality increase`}
                subtitle="Hiring manager approval"
                icon={TrendingUp}
              />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)]">
              <article className="surface-card rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#111827]">
                      Screenings Over Time
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      30-day activity trend for candidates and shortlists.
                    </p>
                  </div>
                  <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-sm text-[#374151]">
                    Last 30 Days
                  </span>
                </div>

                <div className="mt-6 h-[280px] min-h-[280px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={screeningsTimeline}>
                      <CartesianGrid
                        stroke="#F3F4F6"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="uploaded"
                        stroke="#818CF8"
                        strokeWidth={2}
                        name="Uploaded"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="shortlisted"
                        stroke="#312E81"
                        strokeWidth={2}
                        name="Shortlisted"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="surface-card rounded-xl p-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827]">
                    Top Skills Identified
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Frequency of skills across the screened applicant pool.
                  </p>
                </div>

                <div className="mt-6 h-[280px] min-h-[280px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillsFrequency} layout="vertical" margin={{ left: 16 }}>
                      <CartesianGrid stroke="#F3F4F6" horizontal={false} strokeDasharray="3 3" />
                      <XAxis type="number" tickLine={false} axisLine={false} />
                      <YAxis
                        dataKey="skill"
                        type="category"
                        width={88}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                        }}
                      />
                      <Bar dataKey="count" fill="#312E81" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
              <article className="surface-card rounded-xl p-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827]">Candidate Outcomes</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Final conversion status for all evaluated users.
                  </p>
                </div>

                <div className="mt-6 h-[280px] min-h-[280px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Hired", value: outcomes.hired },
                          { name: "Rejected", value: outcomes.rejected },
                          { name: "In Progress", value: outcomes.inProgress },
                        ]}
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {outcomeColors.map((color) => (
                          <Cell key={color} fill={color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[#F3F4F6] pt-4">
                    {[
                      { label: "Hired", value: outcomes.hired, color: "#10B981" },
                      { label: "Rejected", value: outcomes.rejected, color: "#EF4444" },
                      {
                        label: "In Progress",
                        value: outcomes.inProgress,
                        color: "#F59E0B",
                      },
                    ].map((item) => (
                    <div key={item.label}>
                      <p className="text-3xl font-bold" style={{ color: item.color }}>
                        {item.value}%
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="surface-card overflow-hidden rounded-xl">
                <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] px-6 py-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#111827]">
                      Bias Detection History
                    </h2>
                    <Info className="h-4 w-4 text-[#6B7280]" strokeWidth={1.8} />
                  </div>
                  <button type="button" className="button-secondary inline-flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" strokeWidth={1.9} />
                    <span>Audit Logs</span>
                  </button>
                </div>

                <div className="grid grid-cols-[.8fr_1.1fr_1fr_1fr] gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4 text-sm font-medium text-[#6B7280]">
                  <span>Date</span>
                  <span>Target Role</span>
                  <span>Alert Type</span>
                  <span>Action Taken</span>
                </div>

                {biasHistory.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[.8fr_1.1fr_1fr_1fr] gap-4 border-b border-[#E5E7EB] px-6 py-5 text-sm last:border-b-0 hover:bg-[#F9FAFB]"
                  >
                    <span className="text-[#6B7280]">{item.date}</span>
                    <span className="font-medium text-[#111827]">{item.targetRole}</span>
                    <span>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getAlertTypeClass(item.alertType)}`}>
                        {item.alertType}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-[#111827]">
                      <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                      <span>{item.actionTaken}</span>
                    </span>
                  </div>
                ))}
              </article>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  trend,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  subtitle: string;
  icon: typeof Users;
}) {
  return (
    <article className="surface-card rounded-xl p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#6B7280]">{label}</p>
        <span className="rounded-full bg-[#EEF2FF] p-2 text-[#312E81]">
          <Icon className="h-4 w-4" strokeWidth={1.9} />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-4xl font-bold text-[#111827]">{value}</p>
        <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-[#10B981]">
          Up {trend}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#6B7280]">{subtitle}</p>
    </article>
  );
}

function getAlertTypeClass(alertType: string) {
  if (alertType === "Gender Distribution") {
    return "bg-pink-100 text-pink-700";
  }

  if (alertType === "Education Bias") {
    return "bg-amber-100 text-amber-700";
  }

  if (alertType === "Experience Clustering") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-600";
}
