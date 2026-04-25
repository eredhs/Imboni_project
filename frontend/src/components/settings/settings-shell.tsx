"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  Plug,
  Shield,
  SlidersHorizontal,
  User,
  Users,
  Zap,
} from "lucide-react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settings-api";
import toast from "react-hot-toast";

type SettingsTab =
  | "profile"
  | "notifications"
  | "weights"
  | "integrations"
  | "team"
  | "billing";

type WeightKey = "skills" | "experience" | "communication" | "culture";

export function SettingsShell() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("weights");
  const { data, isLoading, isError, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const settings = data?.data;
  const hasData = Boolean(settings);

  const [draftWeights, setDraftWeights] = useState<Record<WeightKey, number> | null>(null);
  const [draftBiasDetection, setDraftBiasDetection] = useState<{
    enabled: boolean;
    educationGuard: boolean;
    clustering: boolean;
  } | null>(null);
  const [draftShortlistSize, setDraftShortlistSize] = useState<10 | 20 | null>(null);
  const [draftAutoRescreen, setDraftAutoRescreen] = useState<boolean | null>(null);

  const weights = draftWeights ?? mapWeights(settings?.scoringWeights) ?? {
    skills: 40,
    experience: 25,
    communication: 20,
    culture: 15,
  };
  const biasDetection = draftBiasDetection ?? mapBiasDetection(settings?.biasDetectionSettings) ?? {
    enabled: true,
    educationGuard: true,
    clustering: false,
  };
  const shortlistSize =
    draftShortlistSize ?? ((settings?.shortlistDefaults.shortlistSize as 10 | 20 | undefined) ?? 10);
  const autoRescreen = draftAutoRescreen ?? settings?.shortlistDefaults.autoRescreen ?? true;

  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);

  const handleWeightChange = (targetKey: WeightKey, nextValue: number) => {
    setDraftWeights((current) => rebalanceWeights(current ?? weights, targetKey, nextValue));
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        scoringWeights: {
          skills: weights.skills,
          experience: weights.experience,
          communication: weights.communication,
          cultureFit: weights.culture,
        },
        biasDetectionSettings: {
          enableRealTimeAlerts: biasDetection.enabled,
          educationUniformityGuard: biasDetection.educationGuard,
          experienceClustering: biasDetection.clustering,
        },
        shortlistDefaults: {
          shortlistSize,
          autoRescreen,
        },
      }).unwrap();
      toast.success("Settings saved");
    } catch {
      toast.error("Settings could not be saved");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your global AI configuration and account preferences.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <LoadingState lines={6} />
            <LoadingState lines={12} />
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8">
            <ErrorState
              title="Settings failed to load"
              description="We could not load your recruiter configuration."
              action={<RetryButton onClick={() => void refetch()} />}
            />
          </div>
        ) : null}

        {!isLoading && !isError && !hasData ? (
          <div className="mt-8">
            <EmptyState
              title="Settings are unavailable"
              description="This workspace has no saved configuration yet."
            />
          </div>
        ) : null}

        {!isLoading && !isError && hasData ? (
          <div className="mt-8 grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-2 border-r border-slate-800 pr-6">
              {[
                { key: "profile", label: "Profile", icon: User },
                { key: "notifications", label: "Notifications", icon: Bell },
                { key: "weights", label: "Scoring Weights", icon: SlidersHorizontal },
                { key: "integrations", label: "Integrations", icon: Plug },
                { key: "team", label: "Team Members", icon: Users },
                { key: "billing", label: "Billing", icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key as SettingsTab)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                    activeTab === item.key
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.9} />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-emerald-400" strokeWidth={1.9} />
                  <h2 className="text-2xl font-bold text-white">Default Scoring Weights</h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    total === 100
                      ? "bg-slate-800 text-white"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  Total: {total}%
                </span>
              </div>

              <article className="surface-card mt-6 rounded-xl p-6">
                <div className="space-y-8">
                  <WeightRow
                    label="Skills Matching"
                    description="Hard skills and technical competency extracted from CV/Portfolio."
                    value={weights.skills}
                    onChange={(value) => handleWeightChange("skills", value)}
                  />
                  <WeightRow
                    label="Relevant Experience"
                    description="Years of experience and industry-specific longevity."
                    value={weights.experience}
                    onChange={(value) => handleWeightChange("experience", value)}
                  />
                  <WeightRow
                    label="Communication Score"
                    description="AI analysis of tone, clarity, and articulation in text/video."
                    value={weights.communication}
                    onChange={(value) => handleWeightChange("communication", value)}
                  />
                  <WeightRow
                    label="Culture Fit Alignment"
                    description="Alignment with company values and team-specific traits."
                    value={weights.culture}
                    onChange={(value) => handleWeightChange("culture", value)}
                  />
                </div>

                <p className="mt-6 text-sm text-[#6B7280]">
                  These weights are applied as defaults to all new job listings created by your
                  team.
                </p>
              </article>

              <div className="mt-10 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" strokeWidth={1.9} />
                  <h2 className="text-2xl font-bold text-white">Bias Detection</h2>
                </div>
              </div>

              <article className="surface-card mt-6 rounded-xl divide-y divide-[#E5E7EB] overflow-hidden">
                <ToggleRow
                  label="Enable Real-time Alerts"
                  description="Notify recruiters immediately if a screening criteria shows potential bias toward a specific demographic or educational background."
                  checked={biasDetection.enabled}
                  onChange={() =>
                    setDraftBiasDetection((current) => ({
                      ...(current ?? biasDetection),
                      enabled: !biasDetection.enabled,
                    }))
                  }
                />
                <ToggleRow
                  label="Education Uniformity Guard"
                  description="Prevents the AI from over-indexing candidates from 'Elite' institutions over equivalent skills and experience."
                  checked={biasDetection.educationGuard}
                  onChange={() =>
                    setDraftBiasDetection((current) => ({
                      ...(current ?? biasDetection),
                      educationGuard: !biasDetection.educationGuard,
                    }))
                  }
                />
                <ToggleRow
                  label="Experience Clustering"
                  description="Allows the model to cluster candidates based on career paths rather than just chronological years. Currently in Beta."
                  checked={biasDetection.clustering}
                  suffix={
                    <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#F59E0B]">
                      Beta
                    </span>
                  }
                  onChange={() =>
                    setDraftBiasDetection((current) => ({
                      ...(current ?? biasDetection),
                      clustering: !biasDetection.clustering,
                    }))
                  }
                />
              </article>

              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="surface-card rounded-xl p-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#312E81]" strokeWidth={1.9} />
                    <h3 className="text-lg font-semibold text-[#111827]">Shortlist Defaults</h3>
                  </div>

                  <div className="mt-5 space-y-4">
                    <label className="flex items-center gap-3 text-sm text-[#111827]">
                      <input
                        type="radio"
                        checked={shortlistSize === 10}
                        onChange={() => setDraftShortlistSize(10)}
                      />
                      <span>Top 10 Candidates</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-[#111827]">
                      <input
                        type="radio"
                        checked={shortlistSize === 20}
                        onChange={() => setDraftShortlistSize(20)}
                      />
                      <span>Top 20 Candidates</span>
                    </label>
                  </div>

                  <p className="mt-5 text-sm italic text-[#6B7280]">
                    The number of candidates automatically moved to the interview stage after
                    screening.
                  </p>
                </article>

                <article className="surface-card rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827]">Automation</h3>
                        <p className="mt-2 text-sm text-[#6B7280]">
                          Run screening automatically on new apps every 6 hours.
                        </p>
                      </div>
                      <Toggle checked={autoRescreen} onChange={() => setDraftAutoRescreen(!autoRescreen)} />
                    </div>
                  </div>
                  <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4 text-sm text-[#6B7280]">
                    Last automated run: 2 hours ago
                  </div>
                </article>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                  className="button-primary px-6 py-3 disabled:cursor-not-allowed disabled:bg-[#818CF8]"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function WeightRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-[#111827]">{label}</p>
          <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
        </div>
        <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-sm font-semibold text-[#312E81]">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min="5"
        max="70"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-[#4338CA]"
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  suffix,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  suffix?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-[#111827]">{label}</p>
          {suffix}
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? "bg-[#4338CA]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function rebalanceWeights(
  current: Record<WeightKey, number>,
  targetKey: WeightKey,
  nextValue: number,
) {
  const clamped = Math.max(5, Math.min(70, nextValue));
  const otherKeys = (Object.keys(current) as WeightKey[]).filter((key) => key !== targetKey);
  const remaining = 100 - clamped;
  const otherTotal = otherKeys.reduce((sum, key) => sum + current[key], 0);
  const nextWeights = { ...current, [targetKey]: clamped };

  let allocated = clamped;
  const fractions: Array<{ key: WeightKey; fraction: number }> = [];

  otherKeys.forEach((key) => {
    const proportional =
      otherTotal === 0 ? remaining / otherKeys.length : (current[key] / otherTotal) * remaining;
    const rounded = Math.floor(proportional);
    nextWeights[key] = rounded;
    allocated += rounded;
    fractions.push({ key, fraction: proportional - rounded });
  });

  let remainder = 100 - allocated;
  fractions
    .sort((left, right) => right.fraction - left.fraction)
    .forEach((item) => {
      if (remainder <= 0) {
        return;
      }

      nextWeights[item.key] += 1;
      remainder -= 1;
    });

  return nextWeights;
}

function mapWeights(weights?: {
  skills: number;
  experience: number;
  communication: number;
  cultureFit: number;
}) {
  if (!weights) {
    return null;
  }

  return {
    skills: weights.skills,
    experience: weights.experience,
    communication: weights.communication,
    culture: weights.cultureFit,
  };
}

function mapBiasDetection(settings?: {
  enableRealTimeAlerts: boolean;
  educationUniformityGuard: boolean;
  experienceClustering: boolean;
}) {
  if (!settings) {
    return null;
  }

  return {
    enabled: settings.enableRealTimeAlerts,
    educationGuard: settings.educationUniformityGuard,
    clustering: settings.experienceClustering,
  };
}
