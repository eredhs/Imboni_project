"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, X, Plus } from "lucide-react";
import type { JobPostingStep2 } from "@/lib/job-posting-types";

interface PostingStep2Props {
  data: Partial<JobPostingStep2>;
  onChange: (data: Partial<JobPostingStep2>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function PostingStep2({ data, onChange, onNext, onPrev, errors }: PostingStep2Props) {
  const [localData, setLocalData] = useState<Partial<JobPostingStep2>>(data);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newNiceToHave, setNewNiceToHave] = useState("");

  const handleDescriptionChange = (value: string) => {
    const updated = { ...localData, description: value };
    setLocalData(updated);
    onChange(updated);
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      const updated = {
        ...localData,
        responsibilities: [...(localData.responsibilities || []), newResponsibility.trim()],
      };
      setLocalData(updated);
      onChange(updated);
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    const updated = {
      ...localData,
      responsibilities: localData.responsibilities?.filter((_, i) => i !== index) || [],
    };
    setLocalData(updated);
    onChange(updated);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updated = {
        ...localData,
        requirements: [...(localData.requirements || []), newRequirement.trim()],
      };
      setLocalData(updated);
      onChange(updated);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const updated = {
      ...localData,
      requirements: localData.requirements?.filter((_, i) => i !== index) || [],
    };
    setLocalData(updated);
    onChange(updated);
  };

  const addNiceToHave = () => {
    if (newNiceToHave.trim()) {
      const updated = {
        ...localData,
        niceToHave: [...(localData.niceToHave || []), newNiceToHave.trim()],
      };
      setLocalData(updated);
      onChange(updated);
      setNewNiceToHave("");
    }
  };

  const removeNiceToHave = (index: number) => {
    const updated = {
      ...localData,
      niceToHave: localData.niceToHave?.filter((_, i) => i !== index) || [],
    };
    setLocalData(updated);
    onChange(updated);
  };

  const canProceed = localData.description?.trim() && (localData.responsibilities?.length ?? 0) > 0 && (localData.requirements?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Job Details & Requirements</h2>
        <p className="text-slate-400">Describe the role, responsibilities, and what you're looking for</p>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-white font-semibold mb-2">Job Description *</label>
        <textarea
          value={localData.description || ""}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Write a compelling description of the role, team, and impact..."
          rows={6}
          className={`w-full bg-slate-800 border-2 text-white rounded-lg px-4 py-3 transition-colors resize-none ${
            errors.description ? "border-red-500" : "border-slate-700 focus:border-purple-500"
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        <p className="text-slate-400 text-sm mt-1">{localData.description?.length || 0} characters</p>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-white font-semibold mb-2">Key Responsibilities *</label>
        <div className="space-y-2 mb-3">
          {(localData.responsibilities || []).map((responsibility, index) => (
            <div key={index} className="flex items-start gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <span className="text-purple-400 font-bold mt-0.5">•</span>
              <span className="text-white flex-1 pt-0.5">{responsibility}</span>
              <button
                onClick={() => removeResponsibility(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addResponsibility()}
            placeholder="Add a responsibility..."
            className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addResponsibility}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {(localData.responsibilities?.length || 0) === 0 && (
          <p className="text-red-400 text-sm mt-2">At least one responsibility is required</p>
        )}
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-white font-semibold mb-2">Required Qualifications *</label>
        <div className="space-y-2 mb-3">
          {(localData.requirements || []).map((requirement, index) => (
            <div key={index} className="flex items-start gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span className="text-white flex-1 pt-0.5">{requirement}</span>
              <button
                onClick={() => removeRequirement(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addRequirement()}
            placeholder="Add a requirement..."
            className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addRequirement}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {(localData.requirements?.length || 0) === 0 && (
          <p className="text-red-400 text-sm mt-2">At least one requirement is required</p>
        )}
      </div>

      {/* Nice to Have */}
      <div>
        <label className="block text-white font-semibold mb-2">Nice to Have (Optional)</label>
        <div className="space-y-2 mb-3">
          {(localData.niceToHave || []).map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <span className="text-blue-400 font-bold mt-0.5">★</span>
              <span className="text-white flex-1 pt-0.5">{item}</span>
              <button
                onClick={() => removeNiceToHave(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newNiceToHave}
            onChange={(e) => setNewNiceToHave(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNiceToHave()}
            placeholder="Add a nice-to-have skill or qualification..."
            className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addNiceToHave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-slate-700 flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Next: Compensation
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          💡 <span className="font-semibold">Tip:</span> Be specific about requirements - this helps filter out unqualified
          candidates and saves everyone's time.
        </p>
      </div>
    </div>
  );
}
