"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Shield,
  Sliders,
  Target,
  Zap,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/shared/query-states";
import { useGetApplicantsQuery } from "@/store/api/jobs-api";
import { useTriggerScreeningMutation } from "@/store/api/screening-api";
import {
  setSkillPriority,
  setStep,
  setThreshold,
  startRun,
  toggleAutoRescreen,
  toggleBiasDetection,
  updateWeight,
} from "@/store/screening-slice";
import type { RootState } from "@/store";

const weightColors = {
  skills: "#10B981",
  experience: "#3B82F6",
  communication: "#F59E0B",
  culture: "#8B5CF6",
} as const;

export function StepThreeConfigureParameters() {
  const dispatch = useDispatch();
  const screeningState = useSelector((state: RootState) => state.screening);
  const selectedJob = screeningState.selectedJob;
  const selectedJobId = screeningState.selectedJobId;
  const { data: applicantsData } = useGetApplicantsQuery(selectedJobId ?? "", {
    skip: !selectedJobId,
  });
  const [triggerScreening, { isLoading: isTriggering }] = useTriggerScreeningMutation();

  const applicantCount = applicantsData?.items?.length ?? 0;

  const totalWeight = useMemo(
    () =>
      screeningState.weights.skills +
      screeningState.weights.experience +
      screeningState.weights.communication +
      screeningState.weights.culture,
    [screeningState.weights],
  );

  const prioritySkills = useMemo(() => {
    const jobSkills = [
      ...(selectedJob?.requiredSkills ?? []),
      ...(selectedJob?.preferredSkills ?? []),
    ];
    const applicantSkills = (applicantsData?.items ?? [])
      .flatMap((applicant) => applicant.skills)
      .filter(Boolean);

    return Array.from(new Set([...jobSkills, ...applicantSkills])).slice(0, 8);
  }, [applicantsData?.items, selectedJob?.preferredSkills, selectedJob?.requiredSkills]);

  const chartData = [
    { name: "Skills", value: screeningState.weights.skills, color: weightColors.skills },
    {
      name: "Experience",
      value: screeningState.weights.experience,
      color: weightColors.experience,
    },
    {
      name: "Communication",
      value: screeningState.weights.communication,
      color: weightColors.communication,
    },
    { name: "Culture", value: screeningState.weights.culture, color: weightColors.culture },
  ];

  const handleWeightChange = (
    key: keyof typeof screeningState.weights,
    value: number,
  ) => {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    const nextWeights = { ...screeningState.weights, [key]: clamped };
    const otherKeys = (Object.keys(nextWeights) as Array<keyof typeof nextWeights>).filter(
      (item) => item !== key,
    );
    const remaining = 100 - clamped;
    const currentOtherTotal = otherKeys.reduce((sum, item) => sum + screeningState.weights[item], 0);

    if (currentOtherTotal === 0) {
      const evenSplit = Math.floor(remaining / otherKeys.length);
      otherKeys.forEach((item) => {
        nextWeights[item] = evenSplit;
      });
    } else {
      otherKeys.forEach((item) => {
        nextWeights[item] = Math.round(
          (screeningState.weights[item] / currentOtherTotal) * remaining,
        );
      });
    }

    const correction = 100 - Object.values(nextWeights).reduce((sum, current) => sum + current, 0);
    if (correction !== 0 && otherKeys[0]) {
      nextWeights[otherKeys[0]] += correction;
    }

    (Object.keys(nextWeights) as Array<keyof typeof nextWeights>).forEach((item) => {
      const nextValue = nextWeights[item];
      if (screeningState.weights[item] !== nextValue) {
        dispatch(updateWeight({ key: item, value: nextValue }));
      }
    });
  };

  const handleBack = () => {
    dispatch(setStep(2));
  };

  const handleRun = async () => {
    if (!selectedJobId || !selectedJob) {
      toast.error("Select a job before starting screening.");
      return;
    }

    if (applicantCount === 0) {
      toast.error("This job does not have applicants to screen yet.");
      return;
    }

    if (totalWeight !== 100) {
      toast.error("Your screening weights must total 100%.");
      return;
    }

    try {
      const response = await triggerScreening({
        jobId: selectedJobId,
        weights: screeningState.weights,
        biasDetection: screeningState.biasDetection,
        shortlistSize: applicantCount > 10 ? 20 : 10,
      }).unwrap();

      dispatch(startRun(response.runId));
      toast.success(`AI screening started for ${selectedJob.title}.`);
    } catch {
      toast.error("Unable to start AI screening right now.");
    }
  };

  if (!selectedJobId || !selectedJob) {
    return (
      <EmptyState
        title="No job selected"
        description="Go back to the first step and choose a job with applicants before configuring screening."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configure AI Parameters</h1>
            <p className="mt-2 text-base text-gray-500">
              Adjust how {selectedJob.title} should be screened across {applicantCount} live
              applicants.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
        <div className="space-y-6">
          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Evaluation Weighting</h2>
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  totalWeight === 100
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                Total: {totalWeight}%
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <WeightCard
                label="Technical skills"
                description="Match the role requirements and preferred stack."
                value={screeningState.weights.skills}
                onChange={(value) => handleWeightChange("skills", value)}
              />
              <WeightCard
                label="Relevant experience"
                description="Prioritize years of direct experience."
                value={screeningState.weights.experience}
                onChange={(value) => handleWeightChange("experience", value)}
              />
              <WeightCard
                label="Communication"
                description="Reward clear, structured candidate profiles and CVs."
                value={screeningState.weights.communication}
                onChange={(value) => handleWeightChange("communication", value)}
              />
              <WeightCard
                label="Culture fit"
                description="Balance team fit without overwhelming skills and experience."
                value={screeningState.weights.culture}
                onChange={(value) => handleWeightChange("culture", value)}
              />
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <Zap size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shortlist Threshold</h2>
            </div>
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#312E81]">
                    Minimum confidence score
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Use a higher threshold when you want a narrower shortlist.
                  </p>
                </div>
                <p className="text-3xl font-bold text-[#312E81]">
                  {screeningState.confidenceThreshold}%
                </p>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={screeningState.confidenceThreshold}
                onChange={(event) => dispatch(setThreshold(Number(event.target.value)))}
                className="w-full accent-[#312E81]"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Lenient</span>
                <span>Balanced</span>
                <span>Strict</span>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <Target size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Skill Priority Matrix</h2>
            </div>
            {prioritySkills.length === 0 ? (
              <p className="text-sm text-gray-500">
                No structured skills were found yet. Applicants can still be screened using
                the role description and general profile data.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {prioritySkills.map((skill) => {
                  const current = screeningState.skillPriorities[skill] ?? "medium";
                  return (
                    <div
                      key={skill}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3"
                    >
                      <p className="text-sm font-medium text-gray-900">{skill}</p>
                      <div className="flex gap-2">
                        {(["low", "medium", "high"] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => dispatch(setSkillPriority({ skill, level }))}
                            className={`rounded px-2 py-1 text-xs font-semibold uppercase transition ${
                              current === level
                                ? "bg-[#312E81] text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <ToggleCard
              icon={<Shield size={16} />}
              label="AI bias detection"
              description="Keep bias detection enabled during screening."
              enabled={screeningState.biasDetection}
              onToggle={() => dispatch(toggleBiasDetection())}
            />
            <ToggleCard
              icon={<RefreshCw size={16} />}
              label="Auto re-screen"
              description="Remember this preference for future new applicants."
              enabled={screeningState.autoRescreen}
              onToggle={() => dispatch(toggleAutoRescreen())}
            />
          </div>
        </div>

        <div className="space-y-6">
          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Weight Distribution</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {chartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Live screening forecast
            </p>
            <div className="mt-4 space-y-4">
              <ForecastRow label="Applicants ready to screen" value={String(applicantCount)} />
              <ForecastRow
                label="Shortlist size"
                value={applicantCount > 10 ? "Top 20" : "Top 10"}
              />
              <ForecastRow
                label="Estimated processing time"
                value={`~${Math.max(8, Math.ceil(applicantCount * 0.9))} seconds`}
              />
            </div>

            <button
              type="button"
              disabled={totalWeight !== 100 || applicantCount === 0 || isTriggering}
              onClick={() => void handleRun()}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#312E81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTriggering ? "Starting AI screening..." : "Continue to AI Screening"}
              <ArrowRight size={16} />
            </button>
          </article>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Review
        </button>
        <p className="text-sm text-gray-500">Step 3 of 5: Configuration</p>
      </div>
    </div>
  );
}

function WeightCard({
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
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
        <p className="text-lg font-bold text-[#312E81]">{value}%</p>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#312E81]"
      />
    </div>
  );
}

function ToggleCard({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-[#312E81]" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ForecastRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
