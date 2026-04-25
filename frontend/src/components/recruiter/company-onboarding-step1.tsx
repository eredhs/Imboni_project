import React from "react";
import type { CompanyOnboardingFormData } from "@/lib/company-onboarding-types";

interface Step1Props {
  formData: Partial<CompanyOnboardingFormData>;
  onChange: (field: string, value: string) => void;
}

export default function CompanyOnboardingStep1({ formData, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Company Information</h2>
        <p className="mt-2 text-slate-400">
          Tell us about your company and how to reach you
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName || ""}
            onChange={(e) => onChange("companyName", e.target.value)}
            placeholder="e.g. InnovateTech Rwanda Ltd"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Your official company name as registered in Rwanda
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200">
            Company Email *
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="recruitment@yourcompany.rw"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            We'll use this to contact you about your application
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+250 788 123 456"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Website (Optional)
            </label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="www.yourcompany.rw"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Helpful Info Card */}
      <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-4">
        <p className="text-sm text-emerald-100">
          ℹ️ <strong>Tip:</strong> Make sure the email and phone number are
          current and monitored by your organization. We may need to verify
          your company using these details.
        </p>
      </div>
    </div>
  );
}
