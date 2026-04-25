import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import type { CompanyOnboardingFormData } from "@/lib/company-onboarding-types";
import CompanyOnboardingStep1 from "./company-onboarding-step1";
import CompanyOnboardingStep2 from "./company-onboarding-step2";
import CompanyOnboardingStep3 from "./company-onboarding-step3";
import CompanyOnboardingStep4 from "./company-onboarding-step4";
import CompanyOnboardingStep5 from "./company-onboarding-step5";

interface CompanyOnboardingWizardProps {
  onSuccess?: (data: CompanyOnboardingFormData) => void;
}

export default function CompanyOnboardingWizard({
  onSuccess,
}: CompanyOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompanyOnboardingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalSteps = 5;

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.companyName && formData.email && formData.phone);
      case 2:
        return !!(formData.industry && formData.size && formData.headquarters && formData.description);
      case 3:
        return !!(formData.registrationNumber && formData.taxId);
      case 4:
        return !!(
          formData.contactPersonName &&
          formData.contactPersonEmail &&
          formData.contactPersonPhone &&
          formData.contactPersonTitle
        );
      case 5:
        return !!(formData.agreementAccepted && formData.privacyAccepted);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const completeData: CompanyOnboardingFormData = {
      ...(formData as CompanyOnboardingFormData),
      id: `company-${Date.now()}`,
      createdAt: new Date(),
      status: "pending",
    };

    setSubmitSuccess(true);
    setIsSubmitting(false);

    // Call success callback if provided
    if (onSuccess) {
      setTimeout(() => onSuccess(completeData), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Join TalentLens</h1>
          <p className="mt-2 text-slate-400">
            Register your company to start hiring top talent in Rwanda
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNum = i + 1;
              return (
                <React.Fragment key={stepNum}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-medium ${
                      stepNum === currentStep
                        ? "bg-emerald-600 text-white"
                        : stepNum < currentStep
                        ? "bg-emerald-600/30 text-emerald-100"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {stepNum < currentStep ? (
                      <CheckCircle size={20} />
                    ) : (
                      stepNum
                    )}
                  </div>

                  {stepNum < totalSteps && (
                    <div
                      className={`flex-1 border-t-2 ${
                        stepNum < currentStep
                          ? "border-emerald-600"
                          : "border-slate-800"
                      }`}
                      style={{ margin: "0 12px" }}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Company Details"}
              {currentStep === 3 && "Business Registration"}
              {currentStep === 4 && "Contact Person"}
              {currentStep === 5 && "Review & Submit"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {!submitSuccess ? (
          <>
            {/* Step Content */}
            <div className="mb-8">
              {currentStep === 1 && (
                <CompanyOnboardingStep1
                  formData={formData}
                  onChange={handleFieldChange}
                />
              )}
              {currentStep === 2 && (
                <CompanyOnboardingStep2
                  formData={formData}
                  onChange={handleFieldChange}
                />
              )}
              {currentStep === 3 && (
                <CompanyOnboardingStep3
                  formData={formData}
                  onChange={handleFieldChange}
                />
              )}
              {currentStep === 4 && (
                <CompanyOnboardingStep4
                  formData={formData}
                  onChange={handleFieldChange}
                />
              )}
              {currentStep === 5 && (
                <CompanyOnboardingStep5
                  formData={formData}
                  onChange={handleFieldChange}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 disabled:opacity-50 hover:border-slate-600 hover:text-white"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-medium text-white disabled:from-slate-700 disabled:to-slate-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : currentStep === totalSteps ? (
                  "Submit Application"
                ) : (
                  <>
                    Next
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/30">
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Application Submitted!
            </h2>
            <p className="mt-3 text-slate-300">
              Thank you for registering your company on TalentLens.
            </p>

            <div className="mt-6 space-y-2 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
              <h3 className="font-semibold text-white">What happens next?</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    1
                  </span>
                  <span>Our team will review your application (2-3 business days)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    2
                  </span>
                  <span>
                    A verification link will be sent to {formData.contactPersonEmail}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    3
                  </span>
                  <span>Once verified, you can start posting jobs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({});
                setSubmitSuccess(false);
              }}
              className="mt-6 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 font-medium text-white hover:from-emerald-700 hover:to-emerald-800"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
