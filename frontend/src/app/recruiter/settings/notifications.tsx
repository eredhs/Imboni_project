"use client";

import { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateNotificationsMutation } from "@/store/api/settings-api";
import { Save, Bell } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

interface NotificationSettings {
  emailOnApplication: boolean;
  emailOnScreeningComplete: boolean;
  emailOnShortlist: boolean;
  emailOnOffer: boolean;
  slackIntegration: boolean;
}

function NotificationsContent() {
  const { data: settingsData } = useGetSettingsQuery();
  const [updateNotifications] = useUpdateNotificationsMutation();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailOnApplication: true,
    emailOnScreeningComplete: true,
    emailOnShortlist: true,
    emailOnOffer: true,
    slackIntegration: false,
  });

  useEffect(() => {
    if (settingsData?.data?.notificationPreferences) {
      setSettings(settingsData.data.notificationPreferences);
    }
  }, [settingsData]);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateNotifications(settings).unwrap();
      alert("Notification settings updated successfully!");
    } catch (error) {
      alert("Failed to update notification settings");
    } finally {
      setSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: "emailOnApplication" as const,
      label: "New Application Received",
      description: "Get notified when candidates submit applications",
    },
    {
      key: "emailOnScreeningComplete" as const,
      label: "Screening Completed",
      description: "Receive alert when AI finishes screening a batch of applications",
    },
    {
      key: "emailOnShortlist" as const,
      label: "Candidate Shortlisted",
      description: "Get notified when top candidates are moved to your shortlist",
    },
    {
      key: "emailOnOffer" as const,
      label: "Offer Accepted",
      description: "Receive confirmation when a candidate accepts your offer",
    },
    {
      key: "slackIntegration" as const,
      label: "Slack Integration",
      description: "Send critical notifications to your Slack workspace",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-slate-400">Control how and when you receive updates</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="bg-slate-700/50 rounded-lg p-6 flex items-start justify-between"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell size={20} className="text-indigo-400" />
                {option.label}
              </h3>
              <p className="text-slate-400 text-sm mt-2">{option.description}</p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => handleToggle(option.key)}
              className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                settings[option.key]
                  ? "bg-indigo-600"
                  : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings[option.key] ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-lg transition-colors mt-8"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Notification Settings"}
        </button>
      </form>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <SettingsLayout>
      <NotificationsContent />
    </SettingsLayout>
  );
}
