import React, { useEffect, useState } from "react";
import { 
  ChevronDown, ChevronUp, Save, AlertCircle, 
  User, Award, Briefcase, GraduationCap, 
  Link as LinkIcon, Settings 
} from "lucide-react";
import type {
  UserProfile,
  UserSkill,
  UserExperience,
  UserEducation,
} from "@/lib/job-seeker-profile-types";
import { DEFAULT_PROFILE } from "@/lib/job-seeker-profile-types";
import { useAuth } from "@/lib/auth-context";
import ProfileBasicInfo from "./profile-basic-info";
import ProfileSkills from "./profile-skills";
import ProfileExperience from "./profile-experience";
import ProfileEducation from "./profile-education";
import ProfileSettings from "./profile-settings";
import ProfilePortfolio from "./profile-portfolio";

const PROFILE_STORAGE_KEY = "talentlens_job_seeker_profile";

export default function ProfileSettingsShell() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() => createProfileFromUser(user));
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicInfo: true,
    skills: true,
    experience: true,
    education: true,
    portfolio: false,
    settings: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      setProfile(deserializeProfile(storedProfile, user));
      return;
    }

    setProfile(createProfileFromUser(user));
  }, [user]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
    setSaveSuccess(false);
  };

  const handleSkillsUpdate = (skills: UserSkill[]) => {
    handleProfileUpdate({ skills });
  };

  const handleExperienceUpdate = (experience: UserExperience[]) => {
    handleProfileUpdate({ experience });
  };

  const handleEducationUpdate = (education: UserEducation[]) => {
    handleProfileUpdate({ education });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Profile Settings
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your professional information and preferences
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-medium text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-700 disabled:to-slate-700"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Save Success Toast */}
          {saveSuccess && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-emerald-950 px-4 py-3 text-emerald-100">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <span className="text-sm">
                Profile updated successfully! Your changes are now live.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Completeness Alert */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
          <AlertCircle className="mt-0.5 flex-shrink-0 text-amber-500" size={18} />
          <div className="flex-1">
            <h3 className="font-medium text-amber-100">Complete Your Profile</h3>
            <p className="mt-1 text-sm text-amber-200/80">
              Profiles that include skills, experience, and education sections
              are 5x more likely to be contacted by recruiters.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Basic Info Section */}
          <ProfileBasicInfoSection
            profile={profile}
            expanded={expandedSections.basicInfo}
            onToggle={() => toggleSection("basicInfo")}
            onUpdate={handleProfileUpdate}
          />

          {/* Skills Section */}
          <ProfileSkillsSection
            skills={profile.skills}
            expanded={expandedSections.skills}
            onToggle={() => toggleSection("skills")}
            onUpdate={handleSkillsUpdate}
          />

          {/* Experience Section */}
          <ProfileExperienceSection
            experience={profile.experience}
            expanded={expandedSections.experience}
            onToggle={() => toggleSection("experience")}
            onUpdate={handleExperienceUpdate}
          />

          {/* Education Section */}
          <ProfileEducationSection
            education={profile.education}
            expanded={expandedSections.education}
            onToggle={() => toggleSection("education")}
            onUpdate={handleEducationUpdate}
          />

          {/* Portfolio Links Section */}
          <ProfilePortfolioSection
            portfolioLinks={profile.portfolioLinks}
            expanded={expandedSections.portfolio}
            onToggle={() => toggleSection("portfolio")}
            onUpdate={(links) => handleProfileUpdate({ portfolioLinks: links })}
          />

          {/* Settings Section */}
          <ProfileSettingsSection
            profile={profile}
            expanded={expandedSections.settings}
            onToggle={() => toggleSection("settings")}
            onUpdate={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
}

function createProfileFromUser(
  user: ReturnType<typeof useAuth>["user"],
): UserProfile {
  const fullName = user?.name?.trim() || "";
  const [firstName = "", ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  return {
    id: user?.id || "profile-local",
    firstName,
    lastName,
    email: user?.email || "",
    phone: "",
    location: user?.location || DEFAULT_PROFILE.location || "Rwanda",
    headline: user?.profession || "",
    bio: "",
    availabilityStatus: DEFAULT_PROFILE.availabilityStatus || "actively_looking",
    skills: [],
    education: [],
    experience: [],
    portfolio: "",
    linkedinProfile: "",
    portfolioLinks: [],
    notificationSettings: {
      emailNotifications: DEFAULT_PROFILE.notificationSettings?.emailNotifications ?? true,
      jobRecommendations: DEFAULT_PROFILE.notificationSettings?.jobRecommendations ?? true,
      applicationUpdates: DEFAULT_PROFILE.notificationSettings?.applicationUpdates ?? true,
      interviewReminders: DEFAULT_PROFILE.notificationSettings?.interviewReminders ?? true,
    },
    privacy: {
      profileVisibility: DEFAULT_PROFILE.privacy?.profileVisibility ?? "recruiters_only",
      showPhoneNumber: DEFAULT_PROFILE.privacy?.showPhoneNumber ?? false,
      showEmail: DEFAULT_PROFILE.privacy?.showEmail ?? true,
    },
  };
}

function deserializeProfile(
  rawProfile: string,
  user: ReturnType<typeof useAuth>["user"],
): UserProfile {
  try {
    const parsed = JSON.parse(rawProfile) as UserProfile & {
      experience?: Array<UserExperience & { startDate: string; endDate?: string }>;
    };

    return {
      ...createProfileFromUser(user),
      ...parsed,
      experience: (parsed.experience ?? []).map((item) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : undefined,
      })),
    };
  } catch {
    return createProfileFromUser(user);
  }
}

/* Section Components */

interface SectionProps {
  expanded: boolean;
  onToggle: () => void;
}

function ProfileBasicInfoSection({
  profile,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><User className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Basic Information</h2>
              <p className="text-sm text-slate-400">
                Name, contact, headline, and bio
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfileBasicInfo profile={profile} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ProfileSkillsSection({
  skills,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  skills: UserSkill[];
  onUpdate: (skills: UserSkill[]) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Award className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Skills</h2>
              <p className="text-sm text-slate-400">
                {skills.length} skills • highlight your expertise
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfileSkills skills={skills} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ProfileExperienceSection({
  experience,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  experience: UserExperience[];
  onUpdate: (experience: UserExperience[]) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Briefcase className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Work Experience</h2>
              <p className="text-sm text-slate-400">
                {experience.length} position{experience.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfileExperience experience={experience} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ProfileEducationSection({
  education,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  education: UserEducation[];
  onUpdate: (education: UserEducation[]) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><GraduationCap className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Education</h2>
              <p className="text-sm text-slate-400">
                {education.length} qualification{education.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfileEducation education={education} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ProfilePortfolioSection({
  portfolioLinks,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  portfolioLinks: Array<{ title: string; url: string }>;
  onUpdate: (links: Array<{ title: string; url: string }>) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><LinkIcon className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Portfolio Links</h2>
              <p className="text-sm text-slate-400">
                {portfolioLinks.length} link{portfolioLinks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfilePortfolio portfolioLinks={portfolioLinks} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ProfileSettingsSection({
  profile,
  expanded,
  onToggle,
  onUpdate,
}: SectionProps & {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Settings className="text-emerald-500" size={20} /></div>
            <div>
              <h2 className="font-semibold text-white">Preferences</h2>
              <p className="text-sm text-slate-400">
                Notifications, privacy, and availability
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-slate-400" size={20} />
          ) : (
            <ChevronDown className="text-slate-400" size={20} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-6">
          <ProfileSettings profile={profile} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}
