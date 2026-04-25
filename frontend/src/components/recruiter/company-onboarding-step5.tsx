import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { CompanyOnboardingFormData } from "@/lib/company-onboarding-types";

interface Step5Props {
  formData: Partial<CompanyOnboardingFormData>;
  onChange: (field: string, value: boolean) => void;
}

export default function CompanyOnboardingStep5({ formData, onChange }: Step5Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Review & Confirm</h2>
        <p className="mt-2 text-slate-400">
          Please review your information before submitting
        </p>
      </div>

      {/* Review Summary */}
      <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-white">Company Information</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-500">Company Name</p>
                <p className="text-white">{formData.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Industry</p>
                <p className="text-white capitalize">
                  {formData.industry?.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Company Size</p>
                <p className="text-white capitalize">
                  {formData.size?.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Headquarters</p>
                <p className="text-white">{formData.headquarters}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white">Contact Information</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-white">{formData.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-white">{formData.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contact Person</p>
                <p className="text-white">
                  {formData.contactPersonName} ({formData.contactPersonTitle})
                </p>
              </div>
            </div>
          </div>

          {/* Business Registration */}
          <div>
            <h3 className="font-semibold text-white">Business Details</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-500">Registration Number</p>
                <p className="text-white">{formData.registrationNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tax ID</p>
                <p className="text-white">{formData.taxId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Documents</p>
                <div className="mt-1 flex gap-2">
                  {formData.businessLicense && (
                    <div className="flex items-center gap-1 rounded bg-emerald-950/30 px-2 py-1 text-xs text-emerald-100">
                      <CheckCircle size={12} />
                      License
                    </div>
                  )}
                  {formData.taxCertificate && (
                    <div className="flex items-center gap-1 rounded bg-emerald-950/30 px-2 py-1 text-xs text-emerald-100">
                      <CheckCircle size={12} />
                      Tax Certificate
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div>
            <h3 className="font-semibold text-white">About Your Company</h3>
            <p className="mt-3 line-clamp-4 text-sm text-slate-300">
              {formData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Agreements</h3>

        <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <input
            type="checkbox"
            checked={formData.agreementAccepted || false}
            onChange={(e) => onChange("agreementAccepted", e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-950"
          />
          <div>
            <p className="font-medium text-white">
              I agree to TalentLens Terms of Service *
            </p>
            <p className="mt-1 text-sm text-slate-400">
              By using TalentLens, you agree to our terms of service and accept
              our platform policies. All job postings must comply with Rwandan
              labor laws.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <input
            type="checkbox"
            checked={formData.privacyAccepted || false}
            onChange={(e) => onChange("privacyAccepted", e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-950"
          />
          <div>
            <p className="font-medium text-white">
              I accept the Privacy Policy *
            </p>
            <p className="mt-1 text-sm text-slate-400">
              I understand and accept how TalentLens handles company and
              candidate data according to our Privacy Policy.
            </p>
          </div>
        </label>
      </div>

      {/* Important Notes */}
      <div className="space-y-3 rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 flex-shrink-0 text-amber-500" size={18} />
          <div className="text-sm text-amber-100">
            <p className="font-medium">What happens next?</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>✓ Your application will be reviewed by our team</li>
              <li>✓ We'll verify your business documents (2-3 business days)</li>
              <li>✓ A verification link will be sent to {formData.contactPersonEmail}</li>
              <li>✓ Once approved, you can start posting jobs!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
