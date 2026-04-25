"use client";

import React, { useState } from "react";
import { ChevronLeft, Check, AlertCircle, MapPin, DollarSign, Briefcase, CalendarIcon } from "lucide-react";
import type { JobPostingFormData } from "@/lib/job-posting-types";

interface PostingStep5Props {
  data: Partial<JobPostingFormData>;
  onPrev: () => void;
  onPublish: () => void;
  isLoading: boolean;
}

export default function PostingStep5({ data, onPrev, onPublish, isLoading }: PostingStep5Props) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const step1 = data.step1;
  const step2 = data.step2;
  const step3 = data.step3;
  const step4 = data.step4;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Job Posting</h2>
        <p className="text-slate-400">Double-check everything before publishing your job on the platform</p>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-slate-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{step1?.title}</h3>
              <p className="text-slate-300 text-lg">{step1?.company}</p>
            </div>
            <div className="text-4xl opacity-60">{step1?.companyLogo || "🏢"}</div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {step1?.location?.city}, {step1?.location?.country}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm capitalize">{step1?.level}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-sm capitalize">{step1?.employmentType?.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-sm capitalize">{step1?.workMode}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">About the Role</h4>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{step2?.description}</p>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Key Responsibilities</h4>
            <ul className="space-y-2">
              {(step2?.responsibilities || []).map((resp, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="text-purple-400 font-bold mt-0.5">•</span>
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Required Qualifications</h4>
            <ul className="space-y-2">
              {(step2?.requirements || []).map((req, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Nice to Have */}
          {(step2?.niceToHave || []).length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Nice to Have</h4>
              <ul className="space-y-2">
                {step2?.niceToHave?.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-300">
                    <span className="text-blue-400 font-bold mt-0.5">★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compensation */}
          {(step3?.salary?.min || step3?.salary?.max) && (
            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white">Salary Range</h4>
              </div>
              <p className="text-emerald-300 font-semibold text-lg">
                {step3.salary.min.toLocaleString()} - {step3.salary.max.toLocaleString()} {step3.salary.currency}
              </p>
            </div>
          )}

          {/* Benefits */}
          {(step3?.benefits || []).length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Benefits & Perks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step3?.benefits?.map((benefit) => (
                  <div key={benefit.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <p className="text-white font-semibold">{benefit.name}</p>
                    <p className="text-slate-400 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {(step3?.perks || []).length > 0 && (
                <div className="mt-4 space-y-2">
                  {step3?.perks?.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="text-blue-400">✨</span>
                      {perk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Screening Questions */}
          {(step4?.screeningQuestions || []).length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Screening Questions</h4>
              <div className="space-y-3">
                {step4?.screeningQuestions?.map((q, i) => (
                  <div key={q.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <p className="text-white font-semibold">
                      {i + 1}. {q.question}
                      {q.required && <span className="text-red-400 ml-2">*</span>}
                    </p>
                    {q.options && (
                      <div className="text-slate-400 text-sm mt-2 space-y-1">
                        {q.options.map((opt, j) => (
                          <p key={j}>• {opt}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadline */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-slate-400 text-sm">Application Deadline</p>
              <p className="text-white font-semibold">
                {step4?.applicationDeadline?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded accent-purple-600 mt-1 flex-shrink-0"
          />
          <div>
            <p className="text-white font-semibold">I confirm this job posting is accurate</p>
            <p className="text-slate-400 text-sm mt-1">
              I have reviewed all information and confirm that the job posting is accurate, compliant with local labor
              laws, and doesn't contain any discriminatory content.
            </p>
          </div>
        </label>
      </div>

      {/* Info Messages */}
      <div className="space-y-3">
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-blue-200 text-sm">
            Your job posting will be live immediately after publishing and visible to all job seekers on IMBONI.
          </p>
        </div>

        <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4 flex gap-3">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-200 text-sm">
            You'll receive notifications when qualified candidates apply. You can manage all applications from your
            dashboard.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-slate-700 flex gap-3">
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={onPublish}
          disabled={!agreedToTerms || isLoading}
          className={`flex-1 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            agreedToTerms && !isLoading
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Check className="w-5 h-5" />
          {isLoading ? "Publishing..." : "Publish Job Posting"}
        </button>
      </div>
    </div>
  );
}
