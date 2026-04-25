"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { getScoreColor } from "@/lib/score-color";
import { useGetScreeningResultsQuery } from "@/store/api/jobs-api";
import { setStep } from "@/store/screening-slice";
import type { RootState } from "@/store";

export function StepFiveResults() {
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedJobId = useSelector((state: RootState) => state.screening.selectedJobId);
  const selectedJob = useSelector((state: RootState) => state.screening.selectedJob);
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetScreeningResultsQuery(selectedJobId ?? "", {
    skip: !selectedJobId,
  });

  const candidates = useMemo(() => data?.items ?? [], [data?.items]);

  if (!selectedJobId) {
    return (
      <EmptyState
        title="No screening run selected"
        description="Choose a job and run screening before opening the results step."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 py-6">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#312E81] px-3 py-1 text-[11px] font-semibold text-white">
            Live AI Results
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {selectedJob?.title ?? data?.job?.title ?? "AI Screening Results"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {data?.analyzed ?? 0} applicants analyzed · {data?.durationSeconds ?? 0}s · top{" "}
            {candidates.length} candidates ready for review
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => dispatch(setStep(3))}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Adjust Configuration
          </button>
          <button
            type="button"
            onClick={() => router.push(`/jobs/${selectedJobId}/screening/results`)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#312E81] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
          >
            Open Full Shortlist
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <LoadingState lines={4} />
          <div className="grid gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingState key={index} lines={6} />
            ))}
          </div>
        </div>
      ) : null}

      {isError ? (
        <ErrorState
          title="Results could not be loaded"
          description="We could not fetch the screening results for this job."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : null}

      {!isLoading && !isError && candidates.length === 0 ? (
        <EmptyState
          title="No results available yet"
          description="The screening run finished, but there were no shortlist results to display."
        />
      ) : null}

      {!isLoading && !isError && data && candidates.length > 0 ? (
        <>
          {data.biasAlert?.detected ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Bias alert detected</p>
                  <p className="mt-1 text-sm text-amber-800">{data.biasAlert.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Bias check complete</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    No meaningful bias alert was detected for this screening run.
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.poolIntelligence ? (
            <div className="mb-6 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] p-5">
              <div className="flex items-center gap-2 text-[#312E81]">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Pool Intelligence</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">{data.poolIntelligence}</p>
            </div>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-3">
            {candidates.slice(0, 9).map((candidate) => (
              <article
                key={candidate.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#312E81]">
                      {getInitials(candidate.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{candidate.fullName}</p>
                      <p className="text-xs text-gray-500">{candidate.currentRole}</p>
                    </div>
                  </div>
                  <ScoreRing score={candidate.score} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#312E81]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  {candidate.yearsExperience} yrs · {candidate.location}
                </div>

                <div className="mt-3">
                  <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-medium text-[#EF4444]">
                    Gap: {candidate.gap}
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-[#312E81]" />
                  <p className="line-clamp-3 text-xs italic leading-6 text-gray-500">
                    {candidate.quote}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-500">
                    {formatConfidence(candidate.confidence)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDrawerCandidateId(candidate.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye size={14} />
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <button
              type="button"
              onClick={() => dispatch(setStep(4))}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Progress
            </button>
            <p className="text-sm text-gray-500">Step 5 of 5: Results</p>
            <button
              type="button"
              onClick={() => router.push(`/jobs/${selectedJobId}/screening/results`)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#312E81] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Continue to Full Shortlist
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      ) : null}

      <CandidateDrawer
        candidateId={drawerCandidateId}
        open={Boolean(drawerCandidateId)}
        onClose={() => setDrawerCandidateId(null)}
      />
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatConfidence(confidence: "high" | "medium" | "uncertain") {
  if (confidence === "high") {
    return "High confidence";
  }
  if (confidence === "medium") {
    return "Medium confidence";
  }
  return "Uncertain confidence";
}

function ScoreRing({ score }: { score: number }) {
  const size = 46;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-[46px] w-[46px] items-center justify-center">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color: getScoreColor(score) }}>
        {score}
      </span>
    </div>
  );
}
