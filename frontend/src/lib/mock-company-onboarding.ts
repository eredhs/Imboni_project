import type {
  CompanyOnboardingFormData,
  CompanyRegistrationStatus,
} from "@/lib/company-onboarding-types";

export const mockCompanyApplications: CompanyOnboardingFormData[] = [
  {
    id: "app-001",
    companyName: "CloudTech Rwanda Ltd",
    email: "recruitment@cloudtech.rw",
    phone: "+250 788 234 567",
    website: "www.cloudtech.rw",
    industry: "technology",
    size: "medium",
    description:
      "Leading cloud infrastructure and managed services provider in East Africa. We specialize in AWS and Azure solutions for enterprise clients across Rwanda, Uganda, and Kenya.",
    headquarters: "Kigali, Rwanda",
    registrationNumber: "BN/2023-00156",
    taxId: "TIN-100652145K",
    businessLicense: null,
    taxCertificate: null,
    contactPersonName: "Jean-Paul Mugabo",
    contactPersonEmail: "jp.mugabo@cloudtech.rw",
    contactPersonPhone: "+250 788 111 222",
    contactPersonTitle: "Head of Human Resources",
    agreementAccepted: true,
    privacyAccepted: true,
    createdAt: new Date(2024, 11, 15),
    status: "pending",
  },
  {
    id: "app-002",
    companyName: "DigitalMark Solutions",
    email: "info@digitalmark.co.rw",
    phone: "+250 789 345 678",
    website: "www.digitalmark.co.rw",
    industry: "technology",
    size: "small",
    description:
      "Digital marketing and web development agency based in Muhanga. We help Rwandan businesses establish and grow their online presence through innovative digital solutions.",
    headquarters: "Muhanga, Rwanda",
    registrationNumber: "BN/2023-00089",
    taxId: "TIN-100789456P",
    businessLicense: null,
    taxCertificate: null,
    contactPersonName: "Muriel Ingabire",
    contactPersonEmail: "muriel@digitalmark.co.rw",
    contactPersonPhone: "+250 787 999 888",
    contactPersonTitle: "Business Development Manager",
    agreementAccepted: true,
    privacyAccepted: true,
    createdAt: new Date(2024, 11, 18),
    status: "pending",
  },
  {
    id: "app-003",
    companyName: "DataViz Analytics Ltd",
    email: "careers@dataviz.rw",
    phone: "+250 790 456 789",
    website: "www.dataviz.rw",
    industry: "technology",
    size: "startup",
    description:
      "Cutting-edge data analytics and business intelligence platform. We empower organizations in Rwanda with data-driven insights and advanced analytics tools.",
    headquarters: "Kigali, Rwanda",
    registrationNumber: "BN/2023-00203",
    taxId: "TIN-100234567M",
    businessLicense: null,
    taxCertificate: null,
    contactPersonName: "Yannick Habimana",
    contactPersonEmail: "yannick@dataviz.rw",
    contactPersonPhone: "+250 786 567 890",
    contactPersonTitle: "Talent Acquisition Lead",
    agreementAccepted: true,
    privacyAccepted: true,
    createdAt: new Date(2024, 11, 20),
    status: "pending",
  },
];

export const mockApprovedCompanies: Omit<
  CompanyOnboardingFormData,
  "businessLicense" | "taxCertificate"
>[] = [
  {
    id: "company-001",
    companyName: "InnovateTech Rwanda",
    email: "recruitment@innovatetech.rw",
    phone: "+250 788 500 600",
    website: "www.innovatetech.rw",
    industry: "technology",
    size: "large",
    description:
      "Premier technology company providing software development, IT consulting, and digital transformation services to Fortune 500 companies across Africa.",
    headquarters: "Kigali, Rwanda",
    registrationNumber: "BN/2022-00045",
    taxId: "TIN-100012345A",
    contactPersonName: "Sophie Ndiaye",
    contactPersonEmail: "sophie.ndiaye@innovatetech.rw",
    contactPersonPhone: "+250 788 600 700",
    contactPersonTitle: "Chief People Officer",
    agreementAccepted: true,
    privacyAccepted: true,
    createdAt: new Date(2024, 8, 15),
    status: "verified" as CompanyRegistrationStatus,
  },
  {
    id: "company-002",
    companyName: "Skyline Solutions",
    email: "jobs@skyline.rw",
    phone: "+250 789 700 800",
    website: "www.skyline.rw",
    industry: "technology",
    size: "large",
    description:
      "Leading digital transformation and systems integration company with expertise in enterprise solutions and cloud migration for East African enterprises.",
    headquarters: "Kigali, Rwanda",
    registrationNumber: "BN/2021-00089",
    taxId: "TIN-100056789B",
    contactPersonName: "Peter Kayongo",
    contactPersonEmail: "peter@skyline.rw",
    contactPersonPhone: "+250 787 800 900",
    contactPersonTitle: "Director of Operations",
    agreementAccepted: true,
    privacyAccepted: true,
    createdAt: new Date(2024, 6, 22),
    status: "verified" as CompanyRegistrationStatus,
  },
];

// Helper functions
export function getCompanyApplicationById(id: string) {
  return mockCompanyApplications.find((app) => app.id === id);
}

export function getAllCompanyApplications() {
  return mockCompanyApplications;
}

export function getApprovedCompanies() {
  return mockApprovedCompanies;
}

export function getCompanyApplicationsByStatus(
  status: CompanyRegistrationStatus
) {
  return mockCompanyApplications.filter((app) => app.status === status);
}
