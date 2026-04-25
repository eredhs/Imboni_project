"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, X, Plus, Calendar } from "lucide-react";
import type { JobPostingStep4, ApplicationQuestion, ApplicationQuestionType } from "@/lib/job-posting-types";

interface PostingStep4Props {
  data: Partial<JobPostingStep4>;
  onChange: (data: Partial<JobPostingStep4>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function PostingStep4({ data, onChange, onNext, onPrev, errors }: PostingStep4Props) {
  const [localData, setLocalData] = useState<Partial<JobPostingStep4>>(data);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionType, setQuestionType] = useState<ApplicationQuestionType>("text");
  const [newOption, setNewOption] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);

  const questionTypes: { value: ApplicationQuestionType; label: string }[] = [
    { value: "text", label: "Short Text" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "file_upload", label: "File Upload" },
  ];

  const handleDeadlineChange = (value: string) => {
    const selectedDate = new Date(`${value}T23:59:59.999`);
    const updated = {
      ...localData,
      applicationDeadline: selectedDate,
    };
    setLocalData(updated);
    onChange(updated);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      const questionToAdd: ApplicationQuestion = {
        id: `q-${Date.now()}`,
        question: newQuestion.trim(),
        type: questionType,
        required: true,
        options: questionType !== "text" && questionType !== "file_upload" ? questionOptions : undefined,
      };

      const updated = {
        ...localData,
        screeningQuestions: [...(localData.screeningQuestions || []), questionToAdd],
      };
      setLocalData(updated);
      onChange(updated);

      setNewQuestion("");
      setQuestionType("text");
      setQuestionOptions([]);
      setEditingQuestionId(null);
    }
  };

  const removeQuestion = (id: string) => {
    const updated = {
      ...localData,
      screeningQuestions: localData.screeningQuestions?.filter((q) => q.id !== id) || [],
    };
    setLocalData(updated);
    onChange(updated);
  };

  const toggleQuestionRequired = (id: string) => {
    const updated = {
      ...localData,
      screeningQuestions: localData.screeningQuestions?.map((q) =>
        q.id === id ? { ...q, required: !q.required } : q
      ),
    };
    setLocalData(updated);
    onChange(updated);
  };

  const addOption = () => {
    if (newOption.trim() && !questionOptions.includes(newOption.trim())) {
      setQuestionOptions([...questionOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setQuestionOptions(questionOptions.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const allRequiredFieldsFilled = localData.applicationDeadline;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Settings</h2>
        <p className="text-slate-400">Customize your screening questions and set the application deadline</p>
      </div>

      {/* Application Deadline */}
      <div>
        <label className="block text-white font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Application Deadline *
        </label>
        <input
          type="date"
          value={formatDate(localData.applicationDeadline)}
          onChange={(e) => handleDeadlineChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
        />
        <p className="text-slate-400 text-sm mt-1">
          Applications will close automatically on this date
        </p>
      </div>

      {/* Screening Questions */}
      <div>
        <label className="block text-white font-semibold mb-3">Screening Questions (Optional)</label>
        <p className="text-slate-400 text-sm mb-4">
          Ask up to 5 custom questions to better evaluate candidates
        </p>

        {/* Current Questions */}
        <div className="space-y-3 mb-4">
          {(localData.screeningQuestions || []).map((question) => (
            <div key={question.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-semibold">{question.question}</p>
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {questionTypes.find((t) => t.value === question.type)?.label}
                    </span>
                  </div>
                  {question.options && (
                    <div className="text-slate-400 text-sm space-y-1">
                      {question.options.map((option, i) => (
                        <p key={i}>• {option}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={() => toggleQuestionRequired(question.id)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(localData.screeningQuestions?.length || 0) < 5 && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => {
                  setQuestionType(e.target.value as ApplicationQuestionType);
                  setQuestionOptions([]);
                }}
                className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Question</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g., What experience do you have with React?"
                className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

            {(questionType === "multiple_choice" || questionType === "checkbox") && (
              <div>
                <label className="block text-slate-300 text-sm mb-2">Answer Options</label>
                <div className="space-y-2 mb-3">
                  {questionOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600/20 border border-purple-500 rounded flex items-center justify-center text-xs text-purple-300">
                        {index + 1}
                      </div>
                      <span className="text-slate-300 flex-1">{option}</span>
                      <button
                        onClick={() => removeOption(index)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addOption()}
                    placeholder="Add an answer option..."
                    className="flex-1 bg-slate-700 border-2 border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={addOption}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={addQuestion}
              disabled={!newQuestion.trim() || (questionType !== "text" && questionType !== "file_upload" && questionOptions.length === 0)}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        )}

        {(localData.screeningQuestions?.length || 0) >= 5 && (
          <div className="text-slate-400 text-sm p-3 bg-slate-800/30 rounded-lg">
            You've reached the maximum of 5 screening questions
          </div>
        )}
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
          disabled={!allRequiredFieldsFilled}
          className={`flex-1 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            allRequiredFieldsFilled
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Next: Review & Publish
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          💡 <span className="font-semibold">Tip:</span> Keep screening questions relevant and short. Too many questions
          can reduce application completion rates.
        </p>
      </div>
    </div>
  );
}
