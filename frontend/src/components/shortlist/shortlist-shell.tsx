"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Filter,
  Flag,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";
import { getScoreColor } from "@/lib/score-color";
import { useGetScreeningResultsQuery } from "@/store/api/jobs-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";

type SortKey = "score" | "name" | "confidence";

export function ShortlistShell({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetScreeningResultsQuery(jobId);
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);
  const [dismissBiasAlert, setDismissBiasAlert] = useState(false);
  const [minimumScore, setMinimumScore] = useState(70);
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleCandidates = useMemo(() => {
    const items = [...(data?.items ?? [])].filter((candidate) => candidate.score >= minimumScore);

    if (sortBy === "name") {
      items.sort((left, right) => left.fullName.localeCompare(right.fullName));
    } else if (sortBy === "confidence") {
      const order = { high: 0, medium: 1, uncertain: 2 };
      items.sort((left, right) => order[left.confidence] - order[right.confidence]);
    } else {
      items.sort((left, right) => right.score - left.score);
    }

    return items;
  }, [data?.items, minimumScore, sortBy]);

  const totalAnalyzed = data?.analyzed ?? 0;
  const totalShown = Math.min(10, totalAnalyzed || visibleCandidates.length);
  const totalPages = Math.max(1, Math.ceil((totalAnalyzed || visibleCandidates.length) / 10));
  const paginationPages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1);

  const toggleCandidate = (candidateId: string) => {
    setSelectedIds((current) => {
      if (current.includes(candidateId)) {
        return current.filter((item) => item !== candidateId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, candidateId];
    });
  };

  return (
    <AppShell activeNav="applicants">
      <section>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#312E81] px-3 py-1 text-xs font-medium text-white">
              ↗ AI INSIGHTS ACTIVE
            </span>
            <h1 className="mt-3 text-2xl font-bold text-[#111827]">
              {data?.job?.title ?? "Shortlist"} — AI Shortlist
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              {totalAnalyzed} applicants analyzed • {data?.durationSeconds ?? 0}s • Top{" "}
              {totalShown} shown
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="button-secondary inline-flex items-center gap-2">
              <span>Export Report</span>
            </button>
            <button type="button" className="button-primary inline-flex items-center gap-2">
              <Share2 className="h-4 w-4" strokeWidth={1.9} />
              <span>Share Shortlist</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-6">
            <LoadingState lines={3} />
            <div className="grid gap-4 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingState key={index} lines={6} />
              ))}
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8">
            <ErrorState
              title="Shortlist unavailable"
              description="The shortlisted candidate results could not be loaded."
              action={<RetryButton onClick={() => void refetch()} />}
            />
          </div>
        ) : null}

        {!isLoading && !isError && visibleCandidates.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No shortlisted candidates"
              description="Run screening or relax the score filter to view results."
            />
          </div>
        ) : null}

        {!isLoading && !isError && data ? (
          <>
            <AnimatePresence>
              {data.biasAlert?.detected && !dismissBiasAlert ? (
                <motion.div
                  className="mt-8 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
                      <div>
                        <div className="flex items-center gap-2 text-[#92400E]">
                          <p className="font-semibold">Bias Alert Detected</p>
                          <span
                            title="Bias detection is heuristic-based and should not be treated as a legal compliance tool."
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#FDE68A] text-xs"
                          >
                            ⓘ
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#92400E]">{data.biasAlert.message}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDismissBiasAlert(true)}
                      className="rounded-full p-1 text-[#92400E] transition hover:bg-[#FDE68A]"
                    >
                      <X className="h-4 w-4" strokeWidth={1.9} />
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white p-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <button type="button" className="button-secondary inline-flex items-center gap-2">
                  <Filter className="h-4 w-4" strokeWidth={1.9} />
                  <span>Filters</span>
                </button>

                <div className="min-w-[220px] rounded-lg border border-[#E5E7EB] px-3 py-2">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                    <span>AI Score Range</span>
                    <span className="text-[#312E81]">{minimumScore} - 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={minimumScore}
                    onChange={(event) => setMinimumScore(Number(event.target.value))}
                    className="mt-2 h-2 w-full accent-[#4338CA]"
                  />
                </div>

                <div className="flex flex-1 flex-wrap gap-3">
                  <select className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#374151]">
                    <option>Skill Match</option>
                  </select>
                  <select className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#374151]">
                    <option>Experience</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#374151]"
                  >
                    <option value="score">Sort By: Score</option>
                    <option value="name">Sort By: Name</option>
                    <option value="confidence">Sort By: Confidence</option>
                  </select>
                </div>

                <div className="ml-auto flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMinimumScore(70);
                      setSortBy("score");
                    }}
                    className="text-sm font-medium text-[#6B7280]"
                  >
                    Reset
                  </button>
                  <button type="button" className="button-primary">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {visibleCandidates.map((candidate, index) => {
                const isSelected = selectedIds.includes(candidate.id);
                return (
                  <motion.button
                    key={candidate.id}
                    type="button"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    onClick={() => setDrawerCandidateId(candidate.id)}
                    className={`rounded-xl border bg-white p-5 text-left transition ${
                      isSelected
                        ? "border-2 border-[#312E81] bg-[#EEF2FF]"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#312E81]">
                          {getInitials(candidate.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">
                            {candidate.fullName}
                          </p>
                          <p className="text-xs text-[#6B7280]">{candidate.currentRole}</p>
                        </div>
                      </div>

                      <ScoreRing score={candidate.score} />
                    </div>

                    <p className="mt-3 text-xs font-medium text-[#6B7280]">
                      <span
                        className="mr-2 inline-flex h-2 w-2 rounded-full"
                        style={{ backgroundColor: getScoreColor(candidate.score) }}
                      />
                      {formatConfidence(candidate.confidence)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#EEF2FF] px-2 py-1 text-xs font-medium text-[#312E81]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2">
                      <span className="rounded-full bg-[#FEE2E2] px-2 py-1 text-xs font-medium text-[#EF4444]">
                        Gap: {candidate.gap}
                      </span>
                    </div>

                    <div className="mt-3 flex items-start gap-2">
                      <Bot className="mt-0.5 h-4 w-4 shrink-0 text-[#312E81]" strokeWidth={1.9} />
                      <p className="line-clamp-2 text-xs italic leading-6 text-[#6B7280]">
                        {candidate.quote}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className="rounded-lg border border-[#E5E7EB] p-2 text-[#6B7280]"
                        >
                          <Flag className="h-4 w-4" strokeWidth={1.9} />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleCandidate(candidate.id);
                          }}
                          className="rounded-lg border border-[#E5E7EB] p-2 text-[#6B7280]"
                        >
                          <UserPlus className="h-4 w-4" strokeWidth={1.9} />
                        </button>
                      </div>

                      {isSelected ? (
                        <span className="rounded-full bg-[#312E81] px-3 py-1 text-xs font-medium text-white">
                          ✓ Added
                        </span>
                      ) : null}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EB] pt-6 text-sm text-[#6B7280]">
              <span>
                Showing 1-{Math.min(visibleCandidates.length, 10)} of {totalAnalyzed} applicants
              </span>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-lg border border-[#E5E7EB] px-3 py-2">
                  &lt;
                </button>
                {paginationPages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`rounded-lg px-3 py-2 ${
                      page === 1 ? "bg-[#312E81] text-white" : "border border-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 ? <span className="px-2">...</span> : null}
                <button type="button" className="rounded-lg border border-[#E5E7EB] px-3 py-2">
                  &gt;
                </button>
              </div>
            </div>

            <AnimatePresence>
              {selectedIds.length >= 2 ? (
                <motion.div
                  className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E7EB] bg-white px-6 py-4 shadow-lg lg:left-[220px]"
                  initial={{ y: 80 }}
                  animate={{ y: 0 }}
                  exit={{ y: 80 }}
                >
                  <div className="mx-auto flex max-w-[1140px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-[#111827]">
                        Compare {selectedIds.length} candidates
                      </span>
                      {selectedIds.map((candidateId) => {
                        const candidate = visibleCandidates.find((item) => item.id === candidateId);
                        return (
                          <span
                            key={candidateId}
                            className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#312E81]"
                          >
                            {candidate?.fullName ?? candidateId}
                            <button
                              type="button"
                              onClick={() => toggleCandidate(candidateId)}
                              className="text-[#312E81]"
                            >
                              <X className="h-3 w-3" strokeWidth={2} />
                            </button>
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="text-sm font-medium text-[#6B7280]"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/jobs/${jobId}/screening/results/compare?ids=${selectedIds.join(",")}`,
                          )
                        }
                        className="button-primary"
                      >
                        Open Comparison
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : null}

        <CandidateDrawer
          candidateId={drawerCandidateId}
          open={Boolean(drawerCandidateId)}
          onClose={() => setDrawerCandidateId(null)}
        />
      </section>
    </AppShell>
  );
}

function formatConfidence(confidence: "high" | "medium" | "uncertain") {
  if (confidence === "high") {
    return "High Confidence";
  }

  if (confidence === "medium") {
    return "Medium Confidence";
  }

  return "Uncertain Confidence";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ScoreRing({ score }: { score: number }) {
  const size = 44;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-11 w-11 items-center justify-center">
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
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color: getScoreColor(score) }}
      >
        {score}
      </span>
    </div>
  );
}
