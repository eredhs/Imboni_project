"use client";

import { useState } from "react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settings-api";
import { Save } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

function ProfileContent() {
  const { data: settingsData } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "IMBONI Demo Company",
    email: "demohr@imboni.io",
    industry: "Technology",
    companySize: "50-200",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ ...settingsData?.data, ...formData }).unwrap();
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-slate-400">Manage your organization profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-700/50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
              >
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Retail</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company Size
              </label>
              <select
                value={formData.companySize}
                onChange={(e) =>
                  setFormData({ ...formData, companySize: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
              >
                <option>10-50</option>
                <option>50-200</option>
                <option>200-500</option>
                <option>500+</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-lg transition-colors"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <ProfileContent />
    </SettingsLayout>
  );
}
