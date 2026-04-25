"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ApiKeysManager } from "@/components/settings/api-keys-manager";
import { Sliders, Shield, Save } from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

type WeightKey = "skills" | "experience" | "communication" | "culture";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 25,
    communication: 20,
    culture: 15,
  });
  const [anonymize, setAnonymize] = useState(true);

  const totalWeight = useMemo(() => 
    weights.skills + weights.experience + weights.communication + weights.culture,
  [weights]);

  const handleWeightChange = (key: WeightKey, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, value))
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings updated successfully");
    }, 800);
  };

  return (
    <AppShell activeNav="settings">
      <div className="max-w-4xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure global AI parameters and platform protocols.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#312E81] text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#4338CA] transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Global Scoring Card */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-[#312E81]" />
                <h2 className="text-lg font-semibold text-gray-900">Default Scoring Weights</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${totalWeight === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                System Balance: {totalWeight}%
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'skills', label: 'Technical Skills', color: '#10B981' },
                { id: 'experience', label: 'Relevant Experience', color: '#3B82F6' },
                { id: 'communication', label: 'Communication Depth', color: '#F59E0B' },
                { id: 'culture', label: 'Culture & Value Fit', color: '#8B5CF6' }
              ].map((item) => (
                <div key={item.id} className="space-y-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-black bg-white px-2 py-1 rounded shadow-sm border border-gray-100" style={{ color: item.color }}>
                      {weights[item.id as WeightKey]}%
                    </span>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range" 
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: item.color }}
                      value={weights[item.id as WeightKey]}
                      onChange={(e) => handleWeightChange(item.id as WeightKey, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-[#10B981]" />
              <h2 className="text-lg font-semibold text-gray-900">Ethical AI & Bias Protection</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Global settings for IMBONI bias detection algorithms.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-gray-900">Anonymize Initial Screening</p>
                  <p className="text-xs text-gray-500">Hide names and gender-identifying photos until shortlist is approved.</p>
                </div>
                <button
                  onClick={() => setAnonymize(!anonymize)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${anonymize ? 'bg-[#312E81]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${anonymize ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* API Keys Section */}
          <section>
            <ApiKeysManager />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
