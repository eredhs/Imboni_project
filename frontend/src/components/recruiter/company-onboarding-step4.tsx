import React from "react";
import type { CompanyOnboardingFormData } from "@/lib/company-onboarding-types";

const jobTitles = [
  "HR Manager",
  "Recruitment Manager",
  "Human Resources Director",
  "People Operations Manager",
  "Talent Acquisition Lead",
  "HR Lead",
  "Talent Manager",
  "Other",
];

interface Step4Props {
  formData: Partial<CompanyOnboardingFormData>;
  onChange: (field: string, value: string) => void;
}

export default function CompanyOnboardingStep4({ formData, onChange }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Contact Person</h2>
        <p className="mt-2 text-slate-400">
          We'll use this person as the primary contact for your company
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.contactPersonName || ""}
              onChange={(e) => onChange("contactPersonName", e.target.value)}
              placeholder="e.g. Jean-Paul Mugabo"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Job Title *
            </label>
            <select
              value={formData.contactPersonTitle || ""}
              onChange={(e) => onChange("contactPersonTitle", e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select a job title</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.contactPersonEmail || ""}
            onChange={(e) => onChange("contactPersonEmail", e.target.value)}
            placeholder="jean-paul@yourcompany.com"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            We may send verification emails to this address
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.contactPersonPhone || ""}
            onChange={(e) => onChange("contactPersonPhone", e.target.value)}
            placeholder="+250 788 111 222"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-blue-900/30 bg-blue-950/20 p-4">
        <p className="text-sm text-blue-100">
          👤 <strong>This person will:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-xs text-blue-100/80">
          <li>• Verify your company information</li>
          <li>• Manage job postings on TalentLens</li>
          <li>• Review applicant profiles</li>
          <li>• Communicate with candidates</li>
        </ul>
      </div>

      {/* Verification Notice */}
      <div className="rounded-lg border border-pink-900/30 bg-pink-950/20 p-4">
        <p className="text-sm text-pink-100">
          ⚠️ <strong>Verification:</strong> We'll send a verification link to
          the contact email to confirm this person has authority to represent
          your company.
        </p>
      </div>
    </div>
  );
}
