"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle,
  Clock,
  Cpu,
  Info,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Sliders,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import {
  useGetScreeningStatusQuery,
  useTriggerScreeningMutation,
} from "@/store/api/screening-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import type { Job } from "@/lib/api-types";
import toast from "react-hot-toast";

type WeightKey = "skills" | "experience" | "communication" | "culture";

const weightColors: Record<WeightKey, string> = {
  skills: "#10B981",
  experience: "#3B82F6",
  communication: "#F59E0B",
  culture: "#8B5CF6",
};

export function ScreeningShell({ initialJobId = "" }: { initialJobId?: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetJobsQuery();
  const allJobs = data?.items ?? [];
  
  // Filter jobs to only show those with passed application deadlines
  const jobs = useMemo(() => {
    const now = new Date();
    return allJobs.filter((job) => {
      if (!job.applicationDeadline) return false;
      const deadline = new Date(job.applicationDeadline);
      return deadline < now; // Only show jobs where deadline has passed
    });
  }, [allJobs]);

  const [manualJobId, setManualJobId] = useState("");
  const selectedJobId = manualJobId || initialJobId || "";
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 25,
    communication: 20,
    culture: 15,
  });
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [biasDetection, setBiasDetection] = useState(true);
  const [autoRescreen, setAutoRescreen] = useState(true);
  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [screeningError, setScreeningError] = useState<string | null>(null);

  const [triggerScreening, { isLoading: isTriggering }] = useTriggerScreeningMutation();
  const { data: statusData } = useGetScreeningStatusQuery(
    runId && selectedJobId ? { jobId: selectedJobId, runId } : { jobId: "", runId: "" },
    {
      skip: !runId || !selectedJobId,
      pollingInterval: runId ? 1500 : 0,
    },
  );

  useEffect(() => {
    if (!statusData) {
      return;
    }

    if (statusData.status === "failed") {
      setIsRunning(false);
      setScreeningError("Screening failed. Please try again.");
      return;
    }

    if (statusData.status === "complete") {
      setIsRunning(false);
      setRunId(null);
      setScreeningError(null);
      toast.success("Screening complete.");
      router.push(`/jobs/${selectedJobId}/screening/results`);
    }
  }, [router, selectedJobId, statusData]);

  const totalWeight = useMemo(
    () => weights.skills + weights.experience + weights.communication + weights.culture,
    [weights],
  );

  const previousScreenings = useMemo(() => jobs.slice(0, 3), [jobs]);

  const applicantCount = selectedJob?.applicantCount ?? 0;
  const estimatedSeconds = Math.max(1, Math.ceil(applicantCount * 0.9));

  const handleJobChange = (jobId: string) => {
    setManualJobId(jobId);
    if (jobId) {
      router.push(`/screening?jobId=${jobId}`);
    }
  };

  const handleWeightChange = (key: WeightKey, value: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    const nextWeights = { ...weights, [key]: clamped };
    
    // REBALANCE LOGIC: All 4 must sum exactly to 100
    const otherKeys = (Object.keys(weights) as WeightKey[]).filter(k => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + weights[k], 0);
    const remainingNeeded = 100 - clamped;

    if (otherTotal === 0) {
      const shared = Math.floor(remainingNeeded / 3);
      otherKeys.forEach(k => nextWeights[k] = shared);
    } else {
      otherKeys.forEach(k => {
        nextWeights[k] = Math.round((weights[k] / otherTotal) * remainingNeeded);
      });
    }

    // Adjustment for rounding errors
    const newTotal = Object.values(nextWeights).reduce((a, b) => a + b, 0);
    if (newTotal !== 100) {
      const diff = 100 - newTotal;
      nextWeights[otherKeys[0]] += diff;
    }

    setWeights(nextWeights);
  };

  const startScreening = async () => {
    if (!selectedJobId || totalWeight !== 100) {
      return;
    }

    try {
      setScreeningError(null);
      const response = await triggerScreening({
        jobId: selectedJobId,
        weights,
        biasDetection,
        shortlistSize: 10,
      }).unwrap();
      setRunId(response.runId);
      setIsRunning(true);
    } catch {
      toast.error("Unable to start AI screening.");
    }
  };

  const handleCancelScreening = () => {
    setIsRunning(false);
    setRunId(null);
    setScreeningError(null);
  };

  const handleRetryScreening = () => {
    startScreening();
  };

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      typeof statusData?.progress === "number"
        ? statusData.progress <= 1
          ? statusData.progress * 100
          : statusData.progress
        : 0,
    ),
  );

  const statusText = getStatusText(statusData?.status, statusData?.message);

  const chartData = [
    { name: "Skills", value: weights.skills, color: weightColors.skills },
    { name: "Experience", value: weights.experience, color: weightColors.experience },
    {
      name: "Communication",
      value: weights.communication,
      color: weightColors.communication,
    },
    { name: "Culture", value: weights.culture, color: weightColors.culture },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Screening</h1>
          <p className="mt-2 text-sm text-slate-400">
            Configure weights and execute the automated candidate evaluation engine.
          </p>
        </div>

        <StepProgress />

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
            <LoadingState lines={7} />
            <LoadingState lines={6} />
          </div>
        ) : null}

        {isError ? (
          <ErrorState
            title="Screening data unavailable"
            description="We could not load your jobs and screening configuration."
            action={<RetryButton onClick={() => void refetch()} />}
          />
        ) : null}

        {!isLoading && !isError && jobs.length === 0 ? (
          <EmptyState
            title="No jobs ready for screening"
            description="Create jobs and wait for their application deadlines to pass. Once the deadline has ended, they will appear here for AI screening."
          />
        ) : null}

        {!isLoading && !isError && jobs.length > 0 ? (
          <>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2FD67D]/20 text-[#2FD67D] font-semibold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-white">Select Job to Screen</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Choose which job posting you want to run AI screening on
              </p>
              <select
                value={selectedJobId}
                onChange={(event) => handleJobChange(event.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-slate-500"
              >
                <option value="">-- Select a job --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.applicantCount} applicants)
                  </option>
                ))}
              </select>
              {selectedJob && (
                <div className="mt-4 rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-white">{selectedJob.title}</span> • {applicantCount} applicants ready for screening
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
              <div className="space-y-6">
                <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Sliders className="mr-2 h-5 w-5 text-gray-400" />
                      Evaluation Weighting
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure how to evaluate candidates
                    </p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-bold border ${totalWeight === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    Total: {totalWeight}%
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <WeightCard label="Technical Skills" desc="Assess coding ability & tool proficiency" value={weights.skills} onChange={(v) => handleWeightChange("skills", v)} />
                  <WeightCard label="Industry Experience" desc="Relevant years in specific sectors" value={weights.experience} onChange={(v) => handleWeightChange("experience", v)} />
                  <WeightCard label="Communication" desc="Clarity of thought and explanation" value={weights.communication} onChange={(v) => handleWeightChange("communication", v)} />
                  <WeightCard label="Culture Fit" desc="Alignment with company core values" value={weights.culture} onChange={(v) => handleWeightChange("culture", v)} />
                </div>
                </article>

                {/* SHORTLIST THRESHOLDS */}
                <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm border-t-4 border-t-[#312E81]">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap size={18} className="text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">Shortlist Thresholds</h2>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/30">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-[#312E81] text-sm">Minimum Confidence Score</p>
                        <p className="text-xs text-gray-500 mt-0.5">Only shortlist candidates above this AI confidence level.</p>
                      </div>
                      <p className="text-3xl font-bold text-[#312E81]">{confidenceThreshold}%</p>
                    </div>
                    <input 
                      type="range" min="40" max="100" value={confidenceThreshold} 
                      onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none accent-[#312E81]" 
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                      <span>Lenient (40%+)</span>
                      <span>Balanced (60-80%)</span>
                      <span>Strict (85%+)</span>
                    </div>
                  </div>
                </article>

                {/* SKILL PRIORITY MATRIX */}
                <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Target size={18} className="text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">Skill Priority Matrix</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["React", "TypeScript", "Node.js", "AWS"].map((skill) => (
                      <div key={skill} className="border border-gray-100 rounded-lg px-3 py-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{skill}</span>
                        <div className="flex gap-1">
                          {["Low", "Med", "High"].map((lv) => (
                            <button key={lv} className={`text-[10px] px-2 py-1 rounded font-bold uppercase transition-colors ${lv === 'High' ? 'bg-[#312E81] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                              {lv}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="grid grid-cols-2 gap-4">
                  <ToggleCard icon={<Shield size={16} />} label="AI Bias Detection" desc="Scrub PII and gender identifiers" enabled={biasDetection} onToggle={() => setBiasDetection(!biasDetection)} />
                  <ToggleCard icon={<RefreshCw size={16} />} label="Auto Re-screen" desc="Refresh on new applicant arrival" enabled={autoRescreen} onToggle={() => setAutoRescreen(!autoRescreen)} />
                </div>
              </div>

              <div className="space-y-6">
                <article className="surface-card rounded-xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#111827]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2FD67D]/20 text-[#2FD67D] text-xs font-semibold mr-2">3</span>
                      Logic Preview
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Weight distribution visualizer
                    </p>
                  </div>

                  <div className="mt-6 h-[220px] min-h-[220px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          innerRadius={56}
                          outerRadius={88}
                          paddingAngle={2}
                        >
                          {chartData.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    {chartData.map((item) => (
                      <span
                        key={item.name}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Estimated Processing
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#111827]">
                      ~{estimatedSeconds} Seconds
                    </p>
                  </div>
                </article>

                <button
                  type="button"
                  onClick={() => void startScreening()}
                  disabled={!selectedJobId || totalWeight !== 100 || isTriggering}
                  className="button-primary inline-flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-xs font-semibold">4</span>
                  <Sparkles className="h-4 w-4" strokeWidth={1.9} />
                  <span>Run AI Screening</span>
                </button>

                <div className="rounded-xl border border-[#E5E7EB] bg-[#EEF2FF] px-4 py-3 text-xs leading-6 text-[#312E81]">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4" strokeWidth={1.8} />
                    <p>
                      AI ranks - you always decide. Screening identifies top matches based on
                      your weights. Override and manual review available after results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <article className="surface-card rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-[#111827]">Previous Screenings</h2>
                <Link 
                  href="/screening" 
                  className="text-sm font-medium text-[#312E81] hover:underline"
                >
                  View All History
                </Link>
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl border border-[#E5E7EB]">
                <div className="grid min-w-[860px] grid-cols-[1.5fr_1fr_.7fr_.7fr_1fr_.6fr] gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm font-medium text-[#6B7280]">
                  <span>Job Title</span>
                  <span>Date Conducted</span>
                  <span>Applicants</span>
                  <span>Top Score</span>
                  <span>Bias Alert</span>
                  <span>Actions</span>
                </div>

                {previousScreenings.map((job) => (
                  <div
                    key={job.id}
                    className="grid min-w-[860px] grid-cols-[1.5fr_1fr_.7fr_.7fr_1fr_.6fr] gap-4 border-b border-[#E5E7EB] px-5 py-4 text-sm last:border-b-0"
                  >
                    <span className="font-medium text-[#111827]">{job.title}</span>
                    <span className="text-[#6B7280]">{formatDate(job.createdAt)}</span>
                    <span className="text-[#111827]">{job.applicantCount}</span>
                    <span className="font-semibold text-[#111827]">
                      {job.topScore ? `${job.topScore}%` : "--"}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm">
                      {job.screeningStatus === "Pending" ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-[#EF4444]" strokeWidth={1.9} />
                          <span className="text-[#EF4444]">Education Gap Alert</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-[#10B981]" strokeWidth={1.9} />
                          <span className="text-[#10B981]">Clean</span>
                        </>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-[#E5E7EB] p-2 text-[#6B7280]"
                      >
                        <MoreHorizontal className="h-4 w-4" strokeWidth={1.9} />
                      </button>
                      <button type="button" className="button-secondary px-4 py-2 text-sm">
                        View Results
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </>
        ) : null}
      </section>

      {isRunning || isTriggering || screeningError ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-10 text-center shadow-2xl animate-fade-in-up">
            {screeningError ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="text-xl font-bold">!</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#111827]">
                  {screeningError}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please review your configuration and try again.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleCancelScreening}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRetryScreening}
                    className="flex-1 rounded-lg bg-[#312E81] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2670] transition"
                  >
                    Retry
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-24 h-24 rounded-full bg-[#EEF2FF] border-4 border-[#312E81]/20 flex items-center justify-center animate-[pulse-scale_2s_infinite]">
                  <Cpu size={40} className="text-[#312E81] animate-[spin_10s_linear_infinite]" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-[#111827]">
                  {statusText}
                </h3>
                <div className="mt-8 h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div className="h-full bg-gradient-to-r from-[#312E81] to-[#10B981] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Shield size={12}/> Bias Check</div>
                  <div className="flex items-center gap-1.5"><Bot size={12}/> Model: v4-Pro</div>
                </div>
                <button onClick={handleCancelScreening} className="mt-10 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors">
                  Cancel Analysis
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepProgress() {
  const steps = [
    { label: "Select Job", status: "complete" },
    { label: "Review", status: "complete" },
    { label: "Configure", status: "complete" },
    { label: "Run AI", status: "current" },
    { label: "Results", status: "upcoming" },
  ] as const;

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";
          const isLineActive = step.status === "complete";

          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                    isComplete
                      ? "border-[#312E81] bg-[#312E81] text-white"
                      : isCurrent
                        ? "border-[#312E81] border-2 text-[#312E81]"
                        : "border-[#E5E7EB] text-[#9CA3AF]"
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" strokeWidth={2.2} /> : index + 1}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold ${
                    isCurrent ? "text-[#312E81]" : "text-gray-400 font-semibold"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={`mx-3 h-[2px] flex-1 ${
                    isLineActive ? "bg-[#312E81]" : "bg-[#E5E7EB]"
                  }`}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeightCard({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30">
      <div className="flex justify-between items-start mb-2">
        <div className="pr-2">
          <p className="text-xs font-bold text-gray-900">{label}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{desc}</p>
        </div>
        <span className="text-sm font-bold text-[#312E81]">{value}%</span>
      </div>
      <input 
        type="range" min="0" max="100" value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-[#312E81]" 
      />
    </div>
  );
}

function ToggleCard({ icon, label, desc, enabled, onToggle }: { icon: React.ReactNode; label: string; desc: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">{icon}</div>
        <div>
          <p className="text-xs font-bold text-gray-900">{label}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${enabled ? 'bg-[#312E81]' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-200 ${enabled ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function WeightSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white">{label}</span>
        <span className="rounded-full bg-[#312E81] px-3 py-1 text-xs font-semibold text-white">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-[#312E81]"
        style={{
          background: `linear-gradient(to right, #312E81 0%, #312E81 ${value}%, #E5E7EB ${value}%, #E5E7EB 100%)`,
        }}
      />
    </div>
  );
}

function ToggleRow({
  label,
  subtitle,
  enabled,
  onToggle,
}: {
  label: string;
  subtitle: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-[#312E81]" : "bg-[#D1D5DB]"
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

function formatDate(dateString: string) {
  if (!dateString) {
    return "--";
  }
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getStatusText(status?: string, message?: string) {
  if (message) {
    return message;
  }
  if (status === "parsing") return "Parsing candidate documents...";
  if (status === "extracting") return "Extracting skills and experience...";
  if (status === "scoring") return "Scoring candidates against requirements...";
  if (status === "explaining") return "Generating AI explanations...";
  if (status === "bias_check") return "Running bias detection...";
  if (status === "finalizing") return "Finalizing shortlist...";
  if (status === "complete") return "Complete. Redirecting...";
  if (status === "failed") return "Screening failed.";
  return "Preparing screening...";
}
