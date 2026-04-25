"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { X, Upload, FileText } from "lucide-react";

type ApplicationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  yearsOfExperience: string;
  linkedinUrl: string;
  portfolioUrl: string;
  expectedSalary: string;
  availableFrom: string;
  workAuthorization: string;
  professionalSummary: string;
  coverLetter: string;
  cv: File | null;
};

interface JobApplicationModalProps {
  open: boolean;
  jobTitle: string;
  initialValues: Omit<ApplicationFormValues, "cv">;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ApplicationFormValues) => Promise<void> | void;
}

export function JobApplicationModal({
  open,
  jobTitle,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: JobApplicationModalProps) {
  const [form, setForm] = useState<ApplicationFormValues>({
    ...initialValues,
    cv: null,
  });
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...initialValues, cv: null });
      setIsSubmittingLocal(false);
    }
  }, [open]);
  
  // Don't reset form when initialValues change during submission
  useEffect(() => {
    if (!isSubmittingLocal && open) {
      setForm((current) => ({
        ...current,
        fullName: initialValues.fullName,
        email: initialValues.email,
        phone: initialValues.phone,
        location: initialValues.location,
        currentRole: initialValues.currentRole,
        linkedinUrl: initialValues.linkedinUrl,
        portfolioUrl: initialValues.portfolioUrl,
        professionalSummary: initialValues.professionalSummary,
      }));
    }
  }, [initialValues, open, isSubmittingLocal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingLocal(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  if (!open) return null;

  const updateField = (field: keyof ApplicationFormValues, value: string | File | null) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-emerald-300">Apply for</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{jobTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Share the candidate details and CV the recruiter needs for AI screening.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isSubmittingLocal}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="space-y-6 px-6 py-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" required>
              <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required className={inputClassName} />
            </Field>
            <Field label="Email" required>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required className={inputClassName} />
            </Field>
            <Field label="Phone number">
              <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Current location">
              <input value={form.location} onChange={(e) => updateField("location", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Current role">
              <input value={form.currentRole} onChange={(e) => updateField("currentRole", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Years of experience">
              <input type="number" min="0" value={form.yearsOfExperience} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="LinkedIn URL">
              <input type="url" value={form.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Portfolio URL">
              <input type="url" value={form.portfolioUrl} onChange={(e) => updateField("portfolioUrl", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Expected salary">
              <input value={form.expectedSalary} onChange={(e) => updateField("expectedSalary", e.target.value)} className={inputClassName} />
            </Field>
            <Field label="Available from">
              <input type="date" value={form.availableFrom} onChange={(e) => updateField("availableFrom", e.target.value)} className={inputClassName} />
            </Field>
          </div>

          <Field label="Work authorization / permit status">
            <input value={form.workAuthorization} onChange={(e) => updateField("workAuthorization", e.target.value)} className={inputClassName} />
          </Field>

          <Field label="Professional summary">
            <textarea value={form.professionalSummary} onChange={(e) => updateField("professionalSummary", e.target.value)} rows={4} className={textareaClassName} />
          </Field>

          <Field label="Cover letter">
            <textarea value={form.coverLetter} onChange={(e) => updateField("coverLetter", e.target.value)} rows={5} className={textareaClassName} />
          </Field>

          <div className="rounded-lg border border-dashed border-emerald-700/60 bg-emerald-950/20 p-4">
            <p className="text-sm font-semibold text-white">CV upload</p>
            <p className="mt-1 text-sm text-slate-400">Upload PDF or DOCX so HR and AI screening can use it.</p>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-4 text-sm text-slate-200 transition hover:border-emerald-500">
              <Upload className="h-4 w-4 text-emerald-300" />
              <span>{form.cv ? form.cv.name : "Choose CV file"}</span>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => updateField("cv", e.target.files?.[0] ?? null)}
              />
            </label>
            {form.cv ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                <FileText className="h-4 w-4" />
                <span>{(form.cv.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSubmitting || isSubmittingLocal} className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || isSubmittingLocal || !form.fullName || !form.email || !form.cv} className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300">
              {isSubmitting || isSubmittingLocal ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
        {required ? <span className="ml-1 text-rose-300">*</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500";

const textareaClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500";
