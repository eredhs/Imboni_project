export type CompanySize = "startup" | "small" | "medium" | "large" | "enterprise";

export type CompanyIndustry =
  | "technology"
  | "finance"
  | "healthcare"
  | "retail"
  | "manufacturing"
  | "education"
  | "government"
  | "ngo"
  | "other";

export type CompanyRegistrationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "incomplete";

export interface CompanyOnboardingStep1 {
  companyName: string;
  email: string;
  phone: string;
  website: string;
}

export interface CompanyOnboardingStep2 {
  industry: CompanyIndustry;
  size: CompanySize;
  description: string;
  headquarters: string;
}

export interface CompanyOnboardingStep3 {
  registrationNumber: string;
  taxId: string;
  businessLicense: File | null;
  taxCertificate: File | null;
}

export interface CompanyOnboardingStep4 {
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonTitle: string;
}

export interface CompanyOnboardingStep5 {
  agreementAccepted: boolean;
  privacyAccepted: boolean;
}

export interface CompanyOnboardingFormData
  extends CompanyOnboardingStep1,
    CompanyOnboardingStep2,
    CompanyOnboardingStep3,
    CompanyOnboardingStep4,
    CompanyOnboardingStep5 {
  id?: string;
  createdAt?: Date;
  status?: CompanyRegistrationStatus;
}

export interface CompanyOnboardingState {
  currentStep: number;
  formData: Partial<CompanyOnboardingFormData>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Rwanda Industries
export const rwandaIndustries: { value: CompanyIndustry; label: string }[] = [
  { value: "technology", label: "Technology & Software" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare & Pharma" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education & Training" },
  { value: "government", label: "Government & Public Sector" },
  { value: "ngo", label: "NGO & Non-Profit" },
  { value: "other", label: "Other" },
];

export const companySizes: { value: CompanySize; label: string }[] = [
  { value: "startup", label: "Startup (1-10 employees)" },
  { value: "small", label: "Small Business (11-50 employees)" },
  { value: "medium", label: "Medium (51-200 employees)" },
  { value: "large", label: "Large (201-1,000 employees)" },
  { value: "enterprise", label: "Enterprise (1,000+ employees)" },
];
