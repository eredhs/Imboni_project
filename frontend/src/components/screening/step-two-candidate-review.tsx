"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { useGetApplicantsQuery } from "@/store/api/jobs-api";
import { setStep } from "@/store/screening-slice";
import type { Applicant } from "@/lib/api-types";
import type { RootState } from "@/store";

export function StepTwoCandidateReview() {
  const dispatch = useDispatch();
  const selectedJobId = useSelector((state: RootState) => state.screening.selectedJobId);
  const selectedJob = useSelector((state: RootState) => state.screening.selectedJob);
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetApplicantsQuery(selectedJobId ?? "", {
    skip: !selectedJobId,
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const applicants = data?.items ?? [];

  const poolData = useMemo(() => {
    const qualityCounts = applicants.reduce(
      (accumulator, applicant) => {
        const quality = getApplicantQuality(applicant);
        accumulator[quality] += 1;
        return accumulator;
      },
      { complete: 0, partial: 0, minimal: 0 },
    );

    const readinessScore = applicants.length
      ? Math.round(
          ((qualityCounts.complete * 100 + qualityCounts.partial * 60 + qualityCounts.minimal * 25) /
            applicants.length),
        )
      : 0;

    const skillFrequency = new Map<string, number>();
    applicants.forEach((applicant) => {
      applicant.skills.forEach((skill) => {
        skillFrequency.set(skill, (skillFrequency.get(skill) ?? 0) + 1);
      });
    });

    const [topSkillName = "No skills yet", topSkillCount = 0] =
      [...skillFrequency.entries()].sort((left, right) => right[1] - left[1])[0] ?? [];

    const averageExperience = applicants.length
      ? Math.round(
          (applicants.reduce((sum, applicant) => sum + (applicant.yearsExperience ?? 0), 0) /
            applicants.length) *
            10,
        ) / 10
      : 0;

    return {
      total: applicants.length,
      complete: qualityCounts.complete,
      partial: qualityCounts.partial,
      minimal: qualityCounts.minimal,
      readinessScore,
      topSkill: {
        name: topSkillName,
        percentage: applicants.length
          ? Math.round((topSkillCount / applicants.length) * 100)
          : 0,
      },
      avgExperience: averageExperience,
    };
  }, [applicants]);

  const handleNext = () => {
    if (applicants.length === 0) {
      return;
    }
    dispatch(setStep(3));
  };

  const handleBack = () => {
    dispatch(setStep(1));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Candidate Pool</h1>
        <p className="mt-2 text-base text-gray-500">
          Review the real applicants for{" "}
          <span className="font-semibold text-gray-700">
            {selectedJob?.title ?? "the selected job"}
          </span>{" "}
          before continuing to AI screening.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <LoadingState lines={4} />
          <LoadingState lines={8} />
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          title="Candidate pool unavailable"
          description="We could not load the applicants for this job."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : null}

      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_320px]">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Pool Preview</h2>
              </div>
              <span className="text-sm text-gray-500">
                Showing {applicants.length} of {applicants.length} applicants
              </span>
            </div>

            {applicants.length === 0 ? (
              <EmptyState
                title="No applicants to review"
                description="When a job seeker applies with a CV, that application will appear here and in the recruiter applicants page."
                action={
                  selectedJobId ? (
                    <Link
                      href={`/applicants?jobId=${selectedJobId}`}
                      className="inline-flex rounded-lg border border-[#312E81] px-4 py-2 text-sm font-semibold text-[#312E81]"
                    >
                      Open Applicants Page
                    </Link>
                  ) : null
                }
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="max-h-[520px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          Candidate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          Skills
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          Experience
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          Data quality
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          CV
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant) => {
                        const quality = getApplicantQuality(applicant);
                        return (
                          <tr key={applicant.id} className="border-t border-gray-100">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#312E81]">
                                  {getInitials(applicant.fullName)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {applicant.fullName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {applicant.currentRole || "Current role not provided"} ·{" "}
                                    {applicant.location || "Location not provided"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {applicant.skills.length > 0 ? (
                                  applicant.skills.slice(0, 4).map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#312E81]"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400">No skills captured yet</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {applicant.yearsExperience ?? 0} yrs
                            </td>
                            <td className="px-4 py-4">
                              <QualityBadge quality={quality} />
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {applicant.resume?.fileName ? applicant.resume.fileName : "Missing"}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setDrawerCandidateId(applicant.id)}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedJobId ? (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Recruiter applicants page and screening review now use the same live pool.
                </p>
                <Link
                  href={`/applicants?jobId=${selectedJobId}`}
                  className="text-sm font-semibold text-[#312E81] hover:underline"
                >
                  Open Applicants Page
                </Link>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl bg-[#312E81] p-6 text-white">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-white/60" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Pool Health Summary
              </p>
            </div>

            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold">{poolData.total}</p>
                <p className="mt-1 text-xs text-white/60">Total Applicants</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-300">
                  {poolData.readinessScore}%
                </p>
                <p className="mt-1 text-xs text-white/60">Readiness Score</p>
              </div>
            </div>

            <div className="space-y-3">
              <SummaryRow label="Complete profiles" value={poolData.complete} color="bg-emerald-400" />
              <SummaryRow label="Partial data" value={poolData.partial} color="bg-amber-400" />
              <SummaryRow label="Minimal data" value={poolData.minimal} color="bg-red-400" />
            </div>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Insights
              </p>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <p className="text-white/60 text-xs">Top skill in the pool</p>
                  <p className="font-bold">
                    {poolData.topSkill.name} ({poolData.topSkill.percentage}%)
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Average experience</p>
                  <p className="font-bold">{poolData.avgExperience} yrs</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-6 text-white/80">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <p>
                  Candidates with uploaded CVs and fuller profiles will produce more useful
                  screening explanations in the next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Selection
        </button>
        <p className="text-sm text-gray-500">Step 2 of 5: Candidate Review</p>
        <button
          type="button"
          onClick={handleNext}
          disabled={applicants.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[#312E81] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Configuration
          <ArrowRight size={16} />
        </button>
      </div>

      <CandidateDrawer
        candidateId={drawerCandidateId}
        open={Boolean(drawerCandidateId)}
        onClose={() => setDrawerCandidateId(null)}
      />
    </div>
  );
}

function getApplicantQuality(applicant: Applicant) {
  const score = [
    applicant.fullName,
    applicant.email,
    applicant.currentRole,
    applicant.location,
    applicant.skills.length > 0 ? "skills" : "",
    applicant.resume?.url || applicant.resume?.fileName || "",
    applicant.resume?.extractedText || "",
  ].filter((value) => typeof value === "string" && value.trim().length > 0).length;

  if (score >= 6) {
    return "complete";
  }
  if (score >= 3) {
    return "partial";
  }
  return "minimal";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function QualityBadge({ quality }: { quality: ReturnType<typeof getApplicantQuality> }) {
  if (quality === "complete") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <CheckCircle size={14} />
        Complete
      </span>
    );
  }

  if (quality === "partial") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600">
        <AlertCircle size={14} />
        Partial
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-red-600">
      <AlertCircle size={14} />
      Minimal
    </span>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
      <span className="ml-auto font-bold">{value}</span>
    </div>
  );
}
