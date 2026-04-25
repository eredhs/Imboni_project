"use client";

import React, { useState } from "react";
import { ChevronRight, MapPin, Briefcase } from "lucide-react";
import type { JobPostingStep1, JobLevel, EmploymentType, WorkMode } from "@/lib/job-posting-types";
import { JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/job-posting-types";
import { RWANDA_LOCATIONS, INDUSTRIES } from "@/lib/constants";

interface PostingStep1Props {
  data: Partial<JobPostingStep1>;
  onChange: (data: Partial<JobPostingStep1>) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

export default function PostingStep1({ data, onChange, onNext, errors }: PostingStep1Props) {
  const [localData, setLocalData] = useState<Partial<JobPostingStep1>>(data);

  const handleChange = (field: keyof JobPostingStep1, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleLocationChange = (field: "city" | "country", value: string) => {
    const updated: Partial<JobPostingStep1> = {
      ...localData,
      location: {
        city: field === "city" ? value : localData.location?.city ?? "",
        country: field === "country" ? value : localData.location?.country ?? "Rwanda",
        address: localData.location?.address,
      },
    };
    setLocalData(updated);
    onChange(updated);
  };

  const canProceed =
    localData.title &&
    localData.company &&
    localData.location?.city &&
    localData.workMode &&
    localData.level &&
    localData.employmentType;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Basic Job Information</h2>
        <p className="text-slate-400">Start with the fundamentals about your job opening</p>
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-white font-semibold mb-2">Job Title *</label>
        <input
          type="text"
          value={localData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Senior Frontend Developer, Product Manager"
          className={`w-full bg-slate-800 border-2 text-white rounded-lg px-4 py-3 transition-colors ${
            errors.title ? "border-red-500" : "border-slate-700 focus:border-purple-500"
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        <p className="text-slate-400 text-sm mt-1">Be specific and clear about the position</p>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-white font-semibold mb-2">Company Name *</label>
        <input
          type="text"
          value={localData.company || ""}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="e.g., InnovateTech Rwanda"
          className={`w-full bg-slate-800 border-2 text-white rounded-lg px-4 py-3 transition-colors ${
            errors.company ? "border-red-500" : "border-slate-700 focus:border-purple-500"
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        />
        {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location *
          </label>
          <select
            value={localData.location?.city || ""}
            onChange={(e) => handleLocationChange("city", e.target.value)}
            className={`w-full bg-slate-800 border-2 text-white rounded-lg px-4 py-3 transition-colors ${
              errors.location ? "border-red-500" : "border-slate-700 focus:border-purple-500"
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            <option value="">Select a location...</option>
            {RWANDA_LOCATIONS.map((location, idx) => (
              <option key={`location-${idx}`} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Country</label>
          <input
            type="text"
            value={localData.location?.country || "Rwanda"}
            disabled
            className="w-full bg-slate-700/50 border-2 border-slate-600 text-slate-400 rounded-lg px-4 py-3 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-white font-semibold mb-2">Work Mode *</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {WORK_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleChange("workMode", mode.value)}
              className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                localData.workMode === mode.value
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Level & Employment Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Level *
          </label>
          <select
            value={localData.level || ""}
            onChange={(e) => handleChange("level", e.target.value as JobLevel)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">Select level...</option>
            {JOB_LEVELS.map((level, idx) => (
              <option key={`level-${idx}`} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Employment Type *</label>
          <select
            value={localData.employmentType || ""}
            onChange={(e) => handleChange("employmentType", e.target.value as EmploymentType)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">Select type...</option>
            {EMPLOYMENT_TYPES.map((type, idx) => (
              <option key={`employment-${idx}`} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-6 border-t border-slate-700">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Next: Job Details
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          💡 <span className="font-semibold">Tip:</span> Clear job titles and proper categorization help attract the
          right candidates for your role.
        </p>
      </div>
    </div>
  );
}
