import React, { useState } from "react";
import { Bell, Shield, Settings as SettingsIcon, AlertTriangle, Globe, Search, Lock } from "lucide-react";
import type { UserProfile } from "@/lib/job-seeker-profile-types";

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export default function ProfileSettings({
  profile,
  onUpdate,
}: ProfileSettingsProps) {
  const [notificationSettings, setNotificationSettings] = useState(
    profile.notificationSettings
  );
  const [privacySettings, setPrivacySettings] = useState(profile.privacy);

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    const updated = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(updated);
    onUpdate({
      notificationSettings: updated,
    });
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    const updated = { ...privacySettings, [key]: value };
    setPrivacySettings(updated);
    onUpdate({
      privacy: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={() => handleNotificationToggle("emailNotifications")}
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-slate-400">
                Receive emails about platform updates and important news
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notificationSettings.jobRecommendations}
              onChange={() => handleNotificationToggle("jobRecommendations")}
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Job Recommendations</p>
              <p className="text-sm text-slate-400">
                Get notified about jobs that match your profile
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notificationSettings.applicationUpdates}
              onChange={() => handleNotificationToggle("applicationUpdates")}
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Application Updates</p>
              <p className="text-sm text-slate-400">
                Get notified when recruiters update your application status
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notificationSettings.interviewReminders}
              onChange={() => handleNotificationToggle("interviewReminders")}
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Interview Reminders</p>
              <p className="text-sm text-slate-400">
                Get reminded about upcoming interviews and assessments
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Profile Visibility
            </label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) =>
                handlePrivacyChange("profileVisibility", e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="recruiters_only">Recruiters Only - Verified only</option>
              <option value="private">Private - Hidden from search</option>
            </select>
            <p className="mt-2 text-xs text-slate-400">
              {privacySettings.profileVisibility === "public"
                ? "Your profile appears in recruiter searches and can be shared publicly."
                : privacySettings.profileVisibility === "recruiters_only"
                ? "Your profile is hidden from public search but visible to verified recruiters."
                : "Your profile is hidden from all searches and only you can see it."}
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacySettings.showPhoneNumber}
              onChange={(e) =>
                handlePrivacyChange("showPhoneNumber", e.target.checked)
              }
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Show Phone Number</p>
              <p className="text-sm text-slate-400">
                Allow recruiters to see your phone number on your profile
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacySettings.showEmail}
              onChange={(e) =>
                handlePrivacyChange("showEmail", e.target.checked)
              }
              className="h-5 w-5 rounded border-slate-600 bg-slate-950"
            />
            <div>
              <p className="font-medium text-white">Show Email Address</p>
              <p className="text-sm text-slate-400">
                Allow recruiters to contact you via email shown on profile
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Account Settings */}
      <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon size={20} className="text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Account Settings</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full rounded-lg bg-slate-700 px-4 py-2 text-left font-medium text-white hover:bg-slate-600">
            Change Password
          </button>
          <button className="w-full rounded-lg bg-slate-700 px-4 py-2 text-left font-medium text-white hover:bg-slate-600">
            Connected Accounts
          </button>
          <button className="w-full rounded-lg bg-slate-700 px-4 py-2 text-left font-medium text-white hover:bg-slate-600">
            Download Profile Data
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold text-red-100">Danger Zone</h3>
        </div>
        <button className="w-full rounded-lg border border-red-700 bg-red-950/30 px-4 py-2 font-medium text-red-100 hover:bg-red-950/50">
          Delete Account Permanently
        </button>
        <p className="mt-2 text-xs text-red-100/70">
          This action cannot be undone. All your data will be deleted.
        </p>
      </div>
    </div>
  );
}
