import React from "react";
import type {
  CompanyOnboardingFormData,
  CompanyIndustry,
  CompanySize,
} from "@/lib/company-onboarding-types";
import {
  rwandaIndustries,
  companySizes,
} from "@/lib/company-onboarding-types";

const rwandaCities = [
  "Kigali",
  "Muhanga",
  "Gisenyi",
  "Ruhengeri",
  "Butare",
  "Gitarama",
  "Nyanza",
  "Other",
];

interface Step2Props {
  formData: Partial<CompanyOnboardingFormData>;
  onChange: (field: string, value: string) => void;
}

export default function CompanyOnboardingStep2({ formData, onChange }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Company Details</h2>
        <p className="mt-2 text-slate-400">
          Help us understand your organization better
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Industry *
            </label>
            <select
              value={formData.industry || ""}
              onChange={(e) => onChange("industry", e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select an industry</option>
              {rwandaIndustries.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Company Size *
            </label>
            <select
              value={formData.size || ""}
              onChange={(e) => onChange("size", e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select a company size</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Headquarters Location *
          </label>
          <select
            value={formData.headquarters || ""}
            onChange={(e) => onChange("headquarters", e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select a city</option>
            {rwandaCities.map((city) => (
              <option key={city} value={city}>
                {city}, Rwanda
              </option>
            ))}
          </select>
          {formData.headquarters === "Other" && (
            <input
              type="text"
              placeholder="Please specify city"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              onChange={(e) => onChange("headquarters", e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Company Description *
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Tell us about your company, what you do, your mission and values..."
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            {formData.description?.length || 0}/500 characters
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-blue-900/30 bg-blue-950/20 p-4">
        <p className="text-sm text-blue-100">
          💼 <strong>Why this matters:</strong> This information helps job
          seekers learn about your company and decide if they want to apply.
          Make it compelling!
        </p>
      </div>
    </div>
  );
}
