"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { getScoreColor } from "@/lib/score-color";
import type { ShortlistCandidate } from "@/lib/api-types";
import { useCompareCandidatesMutation } from "@/store/api/screening-api";

type ComparisonCandidate = ShortlistCandidate;

type ComparisonResponse = {
  candidates: ComparisonCandidate[];
  aiRecommendation: string;
};

export function ComparisonShell({ jobId, ids }: { jobId: string; ids: string[] }) {
  const [compareCandidates, { data, isLoading, isError }] =
    useCompareCandidatesMutation();
  const idsKey = useMemo(() => ids.join(","), [ids]);

  useEffect(() => {
    if (ids.length < 2) {
      return;
    }
    void compareCandidates({ jobId, candidateIds: ids });
  }, [compareCandidates, ids, idsKey, jobId]);

  const candidates = (data as ComparisonResponse | undefined)?.candidates ?? [];
  const recommendation = (data as ComparisonResponse | undefined)?.aiRecommendation ?? "";

  return (
    <AppShell activeNav="applicants">
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/jobs/${jobId}/screening/results`}
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
            >
              &lt;- Back to Shortlist
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-[#111827]">
              Candidate Comparison
            </h1>
          </div>
        </div>

        {ids.length < 2 ? (
          <div className="mt-8">
            <EmptyState
              title="Select candidates to compare"
              description="Choose at least two candidates from the shortlist to open the comparison view."
            />
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 space-y-6">
            <LoadingState lines={3} />
            <LoadingState lines={6} />
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8">
            <ErrorState
              title="Comparison unavailable"
              description="The comparison data could not be loaded. Please try again."
              action={<RetryButton onClick={() => compareCandidates({ jobId, candidateIds: ids })} />}
            />
          </div>
        ) : null}

        {!isLoading && !isError && ids.length >= 2 && candidates.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No comparison data"
              description="We could not find enough candidate data to build a comparison."
            />
          </div>
        ) : null}

        {!isLoading && !isError && candidates.length > 0 ? (
          <div className="mt-8 space-y-6">
            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
              <div
                className="min-w-[720px]"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(180px, 220px) repeat(" +
                    candidates.length +
                    ", minmax(220px, 1fr))",
                }}
              >
                <RowHeader label="Candidate" />
                {candidates.map((candidate) => (
                  <CandidateHeader key={candidate.id} candidate={candidate} />
                ))}

                <RowHeader label="Skills Match" shaded />
                {candidates.map((candidate) => (
                  <MetricCell
                    key={candidate.id + "-skills"}
                    value={candidate.score}
                    label={formatSkillLabel(candidate)}
                    shaded
                  />
                ))}

                <RowHeader label="Experience" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-experience"}
                    value={candidate.yearsExperience + " years"}
                  />
                ))}

                <RowHeader label="Education" shaded />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-education"}
                    value={getEducationSummary(candidate)}
                    shaded
                  />
                ))}

                <RowHeader label="Certifications" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-certs"}
                    value={getCertificationSummary(candidate)}
                  />
                ))}

                <RowHeader label="Top Skills" shaded />
                {candidates.map((candidate) => (
                  <TagCell
                    key={candidate.id + "-skills-tags"}
                    items={getTopSkills(candidate)}
                    shaded
                  />
                ))}

                <RowHeader label="Languages" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-languages"}
                    value={getLanguageSummary(candidate)}
                  />
                ))}

                <RowHeader label="Availability" shaded />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-availability"}
                    value={getAvailabilitySummary(candidate)}
                    shaded
                  />
                ))}

                <RowHeader label="Featured Project" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-project"}
                    value={getProjectSummary(candidate)}
                  />
                ))}

                <RowHeader label="Key Strength" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-strength"}
                    value={candidate.reasoning}
                  />
                ))}

                <RowHeader label="Critical Gap" shaded />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-gap"}
                    value={candidate.gap}
                    shaded
                    tone="danger"
                  />
                ))}

                <RowHeader label="Confidence" />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-confidence"}
                    value={formatConfidence(candidate.confidence)}
                  />
                ))}

                <RowHeader label="Recommendation" shaded />
                {candidates.map((candidate) => (
                  <InfoCell
                    key={candidate.id + "-recommendation"}
                    value={candidate.recommendation}
                    shaded
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] p-6">
              <div className="flex items-center gap-2 text-[#312E81]">
                <Sparkles className="h-5 w-5" strokeWidth={1.9} />
                <h2 className="text-lg font-semibold">AI Recommendation</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">{recommendation}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {candidates.map((candidate, index) => (
                  <button key={candidate.id} type="button" className="button-primary">
                    Approve Candidate {String.fromCharCode(65 + index)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
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

function formatSkillLabel(candidate: ComparisonCandidate) {
  const skills = getTopSkills(candidate);
  if (skills.length === 0) {
    return "Skills match";
  }
  return "Skills match (" + skills.join(", ") + ")";
}

function getTopSkills(candidate: ComparisonCandidate) {
  const profileSkills = candidate.talentProfile.skills
    .slice(0, 3)
    .map((skill) => skill.name);

  if (profileSkills.length > 0) {
    return profileSkills;
  }

  return candidate.skills.slice(0, 3);
}

function getEducationSummary(candidate: ComparisonCandidate) {
  const education = candidate.talentProfile.education[0];

  if (!education) {
    return "Not available";
  }

  return `${education.degree} in ${education.fieldOfStudy}`;
}

function getCertificationSummary(candidate: ComparisonCandidate) {
  const certifications =
    candidate.talentProfile.certifications?.map((item) => item.name) ?? [];

  if (certifications.length === 0) {
    return "Not available";
  }

  return certifications.join(", ");
}

function getLanguageSummary(candidate: ComparisonCandidate) {
  const languages = candidate.talentProfile.languages ?? [];

  if (languages.length === 0) {
    return "Not available";
  }

  return languages.map((item) => `${item.name} (${item.proficiency})`).join(", ");
}

function getAvailabilitySummary(candidate: ComparisonCandidate) {
  const availability = candidate.talentProfile.availability;
  const startDate = availability.startDate
    ? new Date(availability.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "On request";

  return `${availability.status} • ${availability.type} • ${startDate}`;
}

function getProjectSummary(candidate: ComparisonCandidate) {
  const project = candidate.talentProfile.projects[0];

  if (!project) {
    return "Not available";
  }

  return `${project.name} (${project.role})`;
}

function RowHeader({ label, shaded }: { label: string; shaded?: boolean }) {
  const base =
    "sticky left-0 z-10 border-b border-[#E5E7EB] px-4 py-4 text-sm font-semibold text-[#111827]";
  const background = shaded ? "bg-[#F9FAFB]" : "bg-white";
  return <div className={base + " " + background}>{label}</div>;
}

function CandidateHeader({ candidate }: { candidate: ComparisonCandidate }) {
  return (
    <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#312E81]">
          {getInitials(candidate.fullName)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{candidate.fullName}</p>
          <p className="text-xs text-[#6B7280]">{candidate.currentRole}</p>
        </div>
      </div>
      <ScoreRing score={candidate.score} />
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
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
      <span className="absolute text-xs font-bold" style={{ color: getScoreColor(score) }}>
        {score}
      </span>
    </div>
  );
}

function MetricCell({
  value,
  label,
  shaded,
}: {
  value: number;
  label: string;
  shaded?: boolean;
}) {
  const percent = Math.max(0, Math.min(100, value));
  const background = shaded ? "bg-[#F9FAFB]" : "bg-white";
  return (
    <div className={"border-b border-[#E5E7EB] px-4 py-4 " + background}>
      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>{label}</span>
        <span className="font-semibold text-[#111827]">{percent}%</span>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-[#E5E7EB]">
        <div
          className="h-2 rounded-full"
          style={{ width: percent + "%", backgroundColor: getScoreColor(percent) }}
        />
      </div>
    </div>
  );
}

function InfoCell({
  value,
  shaded,
  tone,
}: {
  value: string;
  shaded?: boolean;
  tone?: "danger";
}) {
  const background = shaded ? "bg-[#F9FAFB]" : "bg-white";
  const color = tone === "danger" ? "text-[#EF4444]" : "text-[#111827]";
  return (
    <div className={"border-b border-[#E5E7EB] px-4 py-4 text-sm " + background + " " + color}>
      {value}
    </div>
  );
}

function TagCell({ items, shaded }: { items: string[]; shaded?: boolean }) {
  const background = shaded ? "bg-[#F9FAFB]" : "bg-white";
  return (
    <div className={"border-b border-[#E5E7EB] px-4 py-4 " + background}>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-sm text-[#6B7280]">Not available</span>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#312E81]"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
