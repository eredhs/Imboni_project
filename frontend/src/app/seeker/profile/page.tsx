"use client";

import ProfileSettingsShell from "@/components/seeker/profile-settings-shell";
import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";

export default function ProfileSettingsPage() {
  return (
    <JobSeekerLayout>
      <ProfileSettingsShell />
    </JobSeekerLayout>
  );
}