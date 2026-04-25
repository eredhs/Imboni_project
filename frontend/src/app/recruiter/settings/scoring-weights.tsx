"use client";

import { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateScoringWeightsMutation } from "@/store/api/settings-api";
import { Save, Info } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

function ScoringContent() {
  const { data: settingsData } = useGetSettingsQuery();
  const [updateWeights] = useUpdateScoringWeightsMutation();
  const [saving, setSaving] = useState(false);

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 25,
    communication: 20,
    cultureFit: 15,
  });

  useEffect(() => {
    if (settingsData?.data?.scoringWeights) {
      setWeights(settingsData.data.scoringWeights);
    }
  }, [settingsData]);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleChange = (key: string, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, value)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (total !== 100) {
      alert("Weights must total 100%");
      return;
    }

    setSaving(true);
    try {
      await updateWeights(weights).unwrap();
      alert("Scoring weights updated successfully!");
    } catch (error) {
      alert("Failed to update weights");
    } finally {
      setSaving(false);
    }
  };

  const weightConfig = [
    {
      key: "skills",
      label: "Skills Matching",
      description: "Hard skills and technical competency extracted from CV/Portfolio",
      color: "from-blue-600 to-blue-400",
    },
    {
      key: "experience",
      label: "Relevant Experience",
      description: "Years of experience and industry-specific longevity",
      color: "from-purple-600 to-purple-400",
    },
    {
      key: "communication",
      label: "Communication Score",
      description: "AI analysis of tone, clarity, and articulation in text/video",
      color: "from-emerald-600 to-emerald-400",
    },
    {
      key: "cultureFit",
      label: "Culture Fit Alignment",
      description: "Alignment with company values and team-specific traits",
      color: "from-amber-600 to-amber-400",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Scoring Weights Configuration</h2>
        <p className="text-slate-400">
          Customize how AI scores and ranks candidates based on your priorities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            These weights are applied as defaults to all new job listings created by your team. They
            direct how AI evaluates and ranks candidates during screening.
          </div>
        </div>

        {/* Weight Controls */}
        <div className="space-y-6">
          {weightConfig.map((config) => (
            <div
              key={config.key}
              className="bg-slate-700/50 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{config.label}</h3>
                  <p className="text-slate-400 text-sm mt-1">{config.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weights[config.key as keyof typeof weights]}
                    onChange={(e) =>
                      handleChange(config.key, parseInt(e.target.value))
                    }
                    className="w-20 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-center focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
                  />
                  <span className="text-slate-400">%</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights[config.key as keyof typeof weights]}
                  onChange={(e) =>
                    handleChange(config.key, parseInt(e.target.value))
                  }
                  className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600`}
                  style={{
                    backgroundImage: `linear-gradient(to right, #818cf8 0%, #818cf8 ${
                      weights[config.key as keyof typeof weights]
                    }%, #334155 ${weights[config.key as keyof typeof weights]}%, #334155 100%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total Indicator */}
        <div className="bg-slate-600/50 border border-slate-500 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-medium">Total Weight</span>
            <span
              className={`text-2xl font-bold ${
                total === 100 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {total}%
            </span>
          </div>
          {total !== 100 && (
            <p className="text-red-400 text-sm mt-2">
              Weights must total exactly 100%
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving || total !== 100}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-lg transition-colors"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Weight Configuration"}
        </button>
      </form>
    </div>
  );
}

export default function ScoringWeightsPage() {
  return (
    <SettingsLayout>
      <ScoringContent />
    </SettingsLayout>
  );
}
