import React from "react";
import { Upload, CheckCircle, Lock } from "lucide-react";
import type { CompanyOnboardingFormData } from "@/lib/company-onboarding-types";

interface Step3Props {
  formData: Partial<CompanyOnboardingFormData>;
  onChange: (field: string, value: string | File | null) => void;
}

export default function CompanyOnboardingStep3({ formData, onChange }: Step3Props) {
  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(field, file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Business Registration</h2>
        <p className="mt-2 text-slate-400">
          Verify your company with official business documents
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Business Registration Number *
            </label>
            <input
              type="text"
              value={formData.registrationNumber || ""}
              onChange={(e) => onChange("registrationNumber", e.target.value)}
              placeholder="e.g. BN/2023-00156"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              From your Rwanda business registration certificate
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Tax ID (TIN) *
            </label>
            <input
              type="text"
              value={formData.taxId || ""}
              onChange={(e) => onChange("taxId", e.target.value)}
              placeholder="e.g. TIN-100652145K"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Your Tax Identification Number
            </p>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="font-medium text-white">Required Documents</h3>

          {/* Business License */}
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Business License / Registration Certificate
            </label>
            <div className="mt-2">
              {formData.businessLicense ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-950/30 px-3 py-2 text-emerald-100">
                  <CheckCircle size={18} />
                  <span className="text-sm">
                    {(formData.businessLicense as File).name || "Document uploaded"}
                  </span>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/50 px-4 py-6 text-center cursor-pointer transition hover:border-emerald-500 hover:bg-slate-950">
                  <Upload size={20} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Upload business license
                    </p>
                    <p className="text-xs text-slate-500">PDF, JPG, or PNG</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("businessLicense", e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Tax Certificate */}
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Tax Clearance Certificate
            </label>
            <div className="mt-2">
              {formData.taxCertificate ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-950/30 px-3 py-2 text-emerald-100">
                  <CheckCircle size={18} />
                  <span className="text-sm">
                    {(formData.taxCertificate as File).name || "Document uploaded"}
                  </span>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/50 px-4 py-6 text-center cursor-pointer transition hover:border-emerald-500 hover:bg-slate-950">
                  <Upload size={20} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Upload tax certificate
                    </p>
                    <p className="text-xs text-slate-500">PDF, JPG, or PNG</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("taxCertificate", e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
        <div className="flex items-start gap-3">
          <Lock size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-100">
            <strong>Security:</strong> All documents are kept confidential and
            used only for verification. We don't share them with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
