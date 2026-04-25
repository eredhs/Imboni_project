export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type AvailabilityStatus = "actively_looking" | "open_to_offers" | "not_looking";

export interface UserSkill {
  id: string;
  name: string;
  level: SkillLevel;
  endorsements: number;
  yearsOfExperience: number;
}

export interface UserEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface UserExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  skills: string[];
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  headline: string; // Professional headline
  bio: string;
  profilePhoto?: string;
  availabilityStatus: AvailabilityStatus;
  skills: UserSkill[];
  education: UserEducation[];
  experience: UserExperience[];
  portfolio?: string;
  linkedinProfile?: string;
  portfolioLinks: { title: string; url: string }[];
  notificationSettings: {
    emailNotifications: boolean;
    jobRecommendations: boolean;
    applicationUpdates: boolean;
    interviewReminders: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "recruiters_only";
    showPhoneNumber: boolean;
    showEmail: boolean;
  };
}

export const DEFAULT_PROFILE: Partial<UserProfile> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "Rwanda",
  headline: "",
  bio: "",
  availabilityStatus: "actively_looking",
  skills: [],
  education: [],
  experience: [],
  portfolioLinks: [],
  notificationSettings: {
    emailNotifications: true,
    jobRecommendations: true,
    applicationUpdates: true,
    interviewReminders: true,
  },
  privacy: {
    profileVisibility: "recruiters_only",
    showPhoneNumber: false,
    showEmail: true,
  },
};
