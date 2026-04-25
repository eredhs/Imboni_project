"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, X, Plus, DollarSign } from "lucide-react";
import type { JobPostingStep3, Benefit, Currency } from "@/lib/job-posting-types";
import { CURRENCIES } from "@/lib/job-posting-types";

const STANDARD_BENEFITS = [
  { id: "health", name: "Health Insurance", description: "Comprehensive health coverage" },
  { id: "pension", name: "Pension Plan", description: "Retirement savings plan" },
  { id: "leave", name: "Paid Leave", description: "Annual paid time off" },
  { id: "training", name: "Professional Development", description: "Training & certification budget" },
  { id: "meals", name: "Meals & Snacks", description: "Free meals and snacks" },
  { id: "transport", name: "Transport Allowance", description: "Transportation benefits" },
  { id: "gym", name: "Gym Membership", description: "Fitness center access" },
  { id: "remote", name: "Remote Work", description: "Work from home flexibility" },
];

interface PostingStep3Props {
  data: Partial<JobPostingStep3>;
  onChange: (data: Partial<JobPostingStep3>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function PostingStep3({ data, onChange, onNext, onPrev, errors }: PostingStep3Props) {
  const [localData, setLocalData] = useState<Partial<JobPostingStep3>>(data);
  const [showSalary, setShowSalary] = useState(!localData.salary?.isHidden);
  const [newPerk, setNewPerk] = useState("");

  const handleSalaryChange = (
    field: "min" | "max" | "currency" | "isHidden",
    value: number | Currency | boolean,
  ) => {
    const updated: Partial<JobPostingStep3> = {
      ...localData,
      salary: {
        min: field === "min" ? Number(value) : localData.salary?.min ?? 0,
        max: field === "max" ? Number(value) : localData.salary?.max ?? 0,
        currency:
          field === "currency" ? (value as Currency) : localData.salary?.currency ?? "RWF",
        isHidden:
          field === "isHidden" ? Boolean(value) : localData.salary?.isHidden,
      },
    };
    setLocalData(updated);
    onChange(updated);
  };

  const toggleBenefit = (benefitId: string) => {
    const benefit = STANDARD_BENEFITS.find((b) => b.id === benefitId);
    if (!benefit) return;

    const exists = (localData.benefits || []).find((b) => b.id === benefitId);
    const updated = {
      ...localData,
      benefits: exists
        ? localData.benefits?.filter((b) => b.id !== benefitId) || []
        : [...(localData.benefits || []), benefit],
    };
    setLocalData(updated);
    onChange(updated);
  };

  const addPerk = () => {
    if (newPerk.trim()) {
      const updated = {
        ...localData,
        perks: [...(localData.perks || []), newPerk.trim()],
      };
      setLocalData(updated);
      onChange(updated);
      setNewPerk("");
    }
  };

  const removePerk = (index: number) => {
    const updated = {
      ...localData,
      perks: localData.perks?.filter((_, i) => i !== index) || [],
    };
    setLocalData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Compensation & Benefits</h2>
        <p className="text-slate-400">Attract top talent with competitive compensation packages</p>
      </div>

      {/* Salary Section */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          <h3 className="text-white font-bold text-lg">Salary Range</h3>
        </div>

        <div className="space-y-4">
          {/* Toggle Visibility */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showSalary}
              onChange={(e) => {
                setShowSalary(e.target.checked);
                handleSalaryChange("isHidden", !e.target.checked);
              }}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <span className="text-slate-300">Show salary range to candidates</span>
          </label>

          {showSalary && (
            <>
              {/* Currency */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">Currency</label>
                <select
                  value={localData.salary?.currency || "RWF"}
                  onChange={(e) => handleSalaryChange("currency", e.target.value as Currency)}
                  className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min & Max Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    value={localData.salary?.min || ""}
                    onChange={(e) => handleSalaryChange("min", parseInt(e.target.value) || 0)}
                    placeholder="Enter minimum"
                    className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    value={localData.salary?.max || ""}
                    onChange={(e) => handleSalaryChange("max", parseInt(e.target.value) || 0)}
                    placeholder="Enter maximum"
                    className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Salary Preview */}
              {localData.salary?.min && localData.salary?.max && (
                <div className="bg-slate-800/50 rounded p-3 mt-3">
                  <p className="text-emerald-300 font-semibold">
                    {localData.salary.min.toLocaleString()} - {localData.salary.max.toLocaleString()}{" "}
                    {localData.salary.currency}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-white font-semibold mb-3">Select Benefits to Offer</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STANDARD_BENEFITS.map((benefit) => {
            const isSelected = (localData.benefits || []).some((b) => b.id === benefit.id);
            return (
              <button
                key={benefit.id}
                onClick={() => toggleBenefit(benefit.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 text-purple-200"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-purple-500/50"
                }`}
              >
                <p className="font-semibold">{benefit.name}</p>
                <p className="text-sm opacity-80">{benefit.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Perks */}
      <div>
        <label className="block text-white font-semibold mb-2">Additional Perks (Optional)</label>
        <div className="space-y-2 mb-3">
          {(localData.perks || []).map((perk, index) => (
            <div key={index} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <span className="text-blue-400">✨</span>
              <span className="text-white flex-1">{perk}</span>
              <button
                onClick={() => removePerk(index)}
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
            value={newPerk}
            onChange={(e) => setNewPerk(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addPerk()}
            placeholder="e.g., Stock options, Flexible hours, etc."
            className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addPerk}
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
          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
        >
          Next: Application Settings
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
        <p className="text-amber-200 text-sm">
          💡 <span className="font-semibold">Pro Tip:</span> Transparent salary ranges attract better candidates and
          reduce back-and-forth negotiations with serious applicants.
        </p>
      </div>
    </div>
  );
}
