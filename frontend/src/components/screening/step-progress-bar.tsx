"use client";

import { Check } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

interface StepProgressBarProps {
  currentStep: Step;
}

const steps: Array<{ num: Step; label: string }> = [
  { num: 1, label: "Job Selection" },
  { num: 2, label: "Candidate Review" },
  { num: 3, label: "Configuration" },
  { num: 4, label: "AI Processing" },
  { num: 5, label: "Results" },
];

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  return (
    <div className="flex items-center w-full mb-10 px-4">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center flex-1">
          {/* Step Circle */}
          {step.num < currentStep ? (
            // Completed
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#312E81] flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-2">
                {step.label}
              </p>
            </div>
          ) : step.num === currentStep ? (
            // Current
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#312E81] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm border-2 border-[#312E81]">
                {step.num}
              </div>
              <p className="text-[10px] font-bold text-[#312E81] uppercase tracking-widest mt-2">
                {step.label}
              </p>
            </div>
          ) : (
            // Future
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 border-2 border-gray-200 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-gray-400 font-medium text-sm">
                {step.num}
              </div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-2">
                {step.label}
              </p>
            </div>
          )}

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-2 h-0.5 bg-gray-200">
              {step.num < currentStep && (
                <div className="h-0.5 bg-[#312E81] w-full"></div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
