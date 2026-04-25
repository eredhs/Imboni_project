"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { Bot, CheckCircle, ExternalLink, FileText, Mail, MapPin, Phone, X } from "lucide-react";
import { useGetCandidateDetailQuery } from "@/store/api/screening-api";
import { getScoreColor } from "@/lib/score-color";

interface CandidateDrawerProps {
  candidateId: string | null;
  open: boolean;
  onClose: () => void;
}

export function CandidateDrawer({ candidateId, open, onClose }: CandidateDrawerProps) {
  const { data, isLoading, isError } = useGetCandidateDetailQuery(candidateId ?? "", {
    skip: !candidateId || !open,
  });

  const initials = useMemo(() => {
    const name = data?.candidateProfile?.fullName || data?.fullName || "Candidate";
    return name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [data]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 border-b bg-white px-6 py-5">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <X size={18} />
          </button>

          {isLoading ? (
            <div>
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-56 animate-pulse rounded bg-gray-100" />
            </div>
          ) : isError || !data ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Candidate details unavailable</h2>
              <p className="mt-2 text-sm text-gray-500">We could not load this application right now.</p>
            </div>
          ) : (
            <div className="pr-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] text-xl font-bold text-[#312E81]">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {data.candidateProfile?.fullName || data.fullName}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <span>{data.candidateProfile?.currentRole || data.currentRole}</span>
                      {data.verifiedExpertise ? <CheckCircle size={14} className="text-emerald-500" /> : null}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>
                        {data.candidateProfile?.location || data.location || "Location not specified"} ·{" "}
                        {data.candidateProfile?.yearsOfExperience ?? data.yearsExperience} years
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-gray-50 text-lg font-bold" style={{ color: getScoreColor(data.score) }}>
                  {data.score}%
                </div>
              </div>
            </div>
          )}
        </div>

        {!isLoading && !isError && data ? (
          <div className="space-y-6 p-6">
            <section className="grid gap-3 sm:grid-cols-2">
              <InfoCard icon={<Mail size={15} />} label="Email" value={data.candidateProfile?.email || data.email || "Not provided"} />
              <InfoCard icon={<Phone size={15} />} label="Phone" value={data.candidateProfile?.phone || "Not provided"} />
              <InfoCard label="Expected salary" value={data.candidateProfile?.expectedSalary || "Not provided"} />
              <InfoCard label="Available from" value={data.candidateProfile?.availableFrom || "Not provided"} />
              <InfoCard label="Work authorization" value={data.candidateProfile?.workAuthorization || "Not provided"} />
            </section>

            <section className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-[#312E81]" />
                <h3 className="font-semibold text-gray-900">Application Summary</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                {data.candidateProfile?.professionalSummary || data.overview || "No professional summary submitted."}
              </p>
              {data.reasoning ? (
                <p className="mt-3 text-sm italic leading-7 text-gray-500">{data.reasoning}</p>
              ) : null}
            </section>

            <section className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.length > 0 ? data.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#312E81]">
                    {skill}
                  </span>
                )) : <span className="text-sm text-gray-500">No skills extracted yet.</span>}
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">CV</h3>
                </div>
                {data.resume?.url ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data.resume.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Open file
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {data.resume?.fileName || "No CV file uploaded"}
              </p>
              {data.resume?.extractedText ? (
                <div className="mt-4 max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
                  <pre className="whitespace-pre-wrap text-xs leading-6 text-gray-700">
                    {data.resume.extractedText}
                  </pre>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">No extracted CV text is available yet.</p>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Links</h3>
              <div className="mt-3 space-y-2 text-sm">
                {data.candidateProfile?.linkedinUrl ? <ExternalRow label="LinkedIn" href={data.candidateProfile.linkedinUrl} /> : null}
                {data.candidateProfile?.portfolioUrl ? <ExternalRow label="Portfolio" href={data.candidateProfile.portfolioUrl} /> : null}
                {!data.candidateProfile?.linkedinUrl && !data.candidateProfile?.portfolioUrl ? (
                  <p className="text-gray-500">No external links provided.</p>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm text-gray-900">{value}</p>
    </div>
  );
}

function ExternalRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-gray-700 transition hover:bg-gray-50"
    >
      <span>{label}</span>
      <ExternalLink size={14} />
    </a>
  );
}
