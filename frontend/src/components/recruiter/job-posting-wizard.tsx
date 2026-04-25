"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, Loader2, FileText, ClipboardList, 
  DollarSign, Settings2, Sparkles, Trophy 
} from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCreateJobMutation } from "@/store/api/jobs-api";
import PostingStep1 from "@/components/recruiter/job-posting-step1";
import PostingStep2 from "@/components/recruiter/job-posting-step2";
import PostingStep3 from "@/components/recruiter/job-posting-step3";
import PostingStep4 from "@/components/recruiter/job-posting-step4";
import PostingStep5 from "@/components/recruiter/job-posting-step5";
import { DEFAULT_FORM_DATA } from "@/lib/job-posting-types";
import type {
  JobPostingFormData,
  JobPostingStep1,
  JobPostingStep2,
  JobPostingStep3,
  JobPostingStep4,
} from "@/lib/job-posting-types";

type CurrentStep = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { number: 1, label: "Basic Info", icon: <FileText size={20} /> },
  { number: 2, label: "Job Details", icon: <ClipboardList size={20} /> },
  { number: 3, label: "Compensation", icon: <DollarSign size={20} /> },
  { number: 4, label: "Settings", icon: <Settings2 size={20} /> },
  { number: 5, label: "Review", icon: <CheckCircle size={20} /> },
];

function getPublishErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "status" in error) {
    const apiError = error as FetchBaseQueryError & {
      data?: { message?: string; error?: string };
    };

    if (apiError.status === 401) {
      return "Your session expired. Sign in again as a recruiter, then publish the job.";
    }

    if (apiError.status === 403) {
      return "Only recruiter accounts can publish jobs. Sign in with a recruiter account and try again.";
    }

    if (apiError.data?.message) {
      return apiError.data.message;
    }

    if (apiError.data?.error) {
      return apiError.data.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to publish job.";
}

interface SuccessModalProps {
  jobTitle: string;
  onClose: () => void;
}

function SuccessModal({ jobTitle, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Job Posted Successfully!</h2>
        <p className="text-emerald-50/90 mb-6">
          Your job posting for <span className="font-bold">{jobTitle}</span> is now live and candidates can start
          applying.
        </p>

        <div className="space-y-3 mb-6 text-left bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-50">
            <CheckCircle className="w-5 h-5" />
            <span>Job is visible to all seekers</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-50">
            <CheckCircle className="w-5 h-5" />
            <span>You'll receive application notifications</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-50">
            <CheckCircle className="w-5 h-5" />
            <span>Applications close on the set deadline</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-3 rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function JobPostingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
  const [formData, setFormData] = useState<Partial<JobPostingFormData>>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  
  // Real API integration
  const [createJob, { isLoading: isPublishing }] = useCreateJobMutation();

  const handleStep1Change = useCallback((data: Partial<JobPostingStep1>) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...DEFAULT_FORM_DATA.step1!,
        ...prev.step1,
        ...data,
        location: {
          ...DEFAULT_FORM_DATA.step1!.location,
          ...prev.step1?.location,
          ...data.location,
        },
      },
    }));
    setErrors((prev) => ({ ...prev, ...validateStep1(data) }));
  }, []);

  const handleStep2Change = useCallback((data: Partial<JobPostingStep2>) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...DEFAULT_FORM_DATA.step2!,
        ...prev.step2,
        ...data,
      },
    }));
  }, []);

  const handleStep3Change = useCallback((data: Partial<JobPostingStep3>) => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        salary: {
          min: data.salary?.min ?? prev.step3?.salary?.min ?? DEFAULT_FORM_DATA.step3!.salary!.min,
          max: data.salary?.max ?? prev.step3?.salary?.max ?? DEFAULT_FORM_DATA.step3!.salary!.max,
          currency:
            data.salary?.currency ??
            prev.step3?.salary?.currency ??
            DEFAULT_FORM_DATA.step3!.salary!.currency,
          isHidden:
            data.salary?.isHidden ??
            prev.step3?.salary?.isHidden ??
            DEFAULT_FORM_DATA.step3!.salary!.isHidden,
        },
        benefits: data.benefits ?? prev.step3?.benefits ?? DEFAULT_FORM_DATA.step3!.benefits,
        perks: data.perks ?? prev.step3?.perks ?? DEFAULT_FORM_DATA.step3!.perks,
      },
    }));
  }, []);

  const handleStep4Change = useCallback((data: Partial<JobPostingStep4>) => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...DEFAULT_FORM_DATA.step4!,
        ...prev.step4,
        ...data,
      },
    }));
  }, []);

  const validateStep1 = (data: any) => {
    const newErrors: Record<string, string> = {};
    if (!data.title?.trim()) newErrors.title = "Job title is required";
    if (!data.company?.trim()) newErrors.company = "Company name is required";
    if (!data.location?.city) newErrors.location = "City is required";
    return newErrors;
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as CurrentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CurrentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublish = async () => {
    try {
      setPublishError(null);

      const title = formData.step1?.title?.trim() || "";
      const description = formData.step2?.description?.trim() || "";
      const city = formData.step1?.location?.city?.trim() || "";
      const country = formData.step1?.location?.country?.trim() || "Rwanda";
      const deadline = formData.step4?.applicationDeadline;

      if (!title || !description || !city || !deadline) {
        setPublishError("Complete all required job fields before publishing.");
        return;
      }

      const locationString = formData.step1?.location
        ? `${city}, ${country}`
        : "";

      const responsibilities = formData.step2?.responsibilities ?? [];
      const requirements = formData.step2?.requirements ?? [];
      const niceToHave = formData.step2?.niceToHave ?? [];
      const level = formData.step1?.level ?? "mid";
      const employmentType = formData.step1?.employmentType ?? "full_time";

      const applicationDeadline = new Date(deadline);
      applicationDeadline.setHours(23, 59, 59, 999);

      const jobPayload = {
        title,
        description: [
          description,
          responsibilities.length > 0
            ? `Responsibilities:\n${responsibilities.map((item) => `- ${item}`).join("\n")}`
            : "",
          requirements.length > 0
            ? `Requirements:\n${requirements.map((item) => `- ${item}`).join("\n")}`
            : "",
          niceToHave.length > 0
            ? `Nice to have:\n${niceToHave.map((item) => `- ${item}`).join("\n")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        department: "General",
        location: locationString,
        seniority: level.replace("_", "-"),
        type: employmentType.replace("_", "-"),
        status: "active",
        requiredSkills: requirements,
        preferredSkills: niceToHave,
        minExperienceYears:
          level === "entry"
            ? 0
            : level === "mid"
                ? 3
                : level === "senior"
                  ? 5
                  : 7,
        educationLevel: "Bachelor",
        applicationDeadline: applicationDeadline.toISOString(),
      };

      await createJob(jobPayload as any).unwrap();
      setShowSuccess(true);
    } catch (err) {
      const message = getPublishErrorMessage(err);
      setPublishError(message);
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create a New Job Posting</h1>
          <p className="text-slate-400">Step {currentStep} of 5: {STEPS[currentStep - 1].label}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="mb-12 flex justify-between">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                  currentStep >= step.number
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-slate-800 text-slate-500 border-2 border-slate-700"
                }`}
              >
                {step.icon}
              </div>
              <p className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
          {publishError ? (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {publishError}
            </div>
          ) : null}

          {currentStep === 1 && (
            <PostingStep1
              data={formData.step1 || {}}
              onChange={handleStep1Change}
              onNext={handleNextStep}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <PostingStep2
              data={formData.step2 || {}}
              onChange={handleStep2Change}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <PostingStep3
              data={formData.step3 || {}}
              onChange={handleStep3Change}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <PostingStep4
              data={formData.step4 || {}}
              onChange={handleStep4Change}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              errors={errors}
            />
          )}

          {currentStep === 5 && (
            <PostingStep5
              data={formData}
              onPrev={handlePrevStep}
              onPublish={handlePublish}
              isLoading={isPublishing}
            />
          )}
        </div>

        {/* Footer Help Text */}
        <div className="text-center text-slate-400 text-sm">
          <p>
            Need help? Contact our support team at <span className="text-emerald-400">support@imboni.rw</span>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal 
          jobTitle={formData.step1?.title || "Job"} 
          onClose={() => router.push("/dashboard")} 
        />
      )}
    </div>
  );
}
