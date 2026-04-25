"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { Cpu, File, Shield, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useGetScreeningStatusQuery } from "@/store/api/screening-api";
import { cancelRun, setStep, updateProgress } from "@/store/screening-slice";
import type { RootState } from "@/store";

export function StepFourRunning() {
  const dispatch = useDispatch();
  const screeningState = useSelector((state: RootState) => state.screening);
  const selectedJob = screeningState.selectedJob;

  const { data: statusData } = useGetScreeningStatusQuery(
    screeningState.runId && screeningState.selectedJobId
      ? { jobId: screeningState.selectedJobId, runId: screeningState.runId }
      : { jobId: "", runId: "" },
    {
      skip: !screeningState.runId || !screeningState.selectedJobId,
      pollingInterval: 1500,
    },
  );

  const percentage = Math.min(
    100,
    Math.max(
      0,
      typeof statusData?.progress === "number"
        ? statusData.progress <= 1
          ? Math.round(statusData.progress * 100)
          : Math.round(statusData.progress)
        : 0,
    ),
  );

  useEffect(() => {
    if (!statusData) {
      return;
    }

    dispatch(
      updateProgress({
        done: percentage,
        total: 100,
        status: statusData.status as RootState["screening"]["status"],
      }),
    );

    if (statusData.status === "complete") {
      const timer = setTimeout(() => {
        dispatch(setStep(5));
      }, 900);

      return () => clearTimeout(timer);
    }

    return;
  }, [dispatch, percentage, statusData]);

  const handleCancel = () => {
    dispatch(cancelRun());
    dispatch(setStep(3));
  };

  const statusMessage = statusData?.message || "Preparing live screening...";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="relative mb-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#312E81] bg-[#EEF2FF] animate-pulse-scale">
            <Cpu size={52} className="text-[#312E81]" />
          </div>
        </div>

        <p className="mb-2 text-6xl font-bold text-[#312E81]">{percentage}%</p>
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
          AI Processing Engine Active
        </p>

        <div className="mb-4 h-2 w-96 max-w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#312E81] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mb-8 text-center text-base font-medium text-gray-700">
          {statusMessage}
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <InfoChip
            icon={<File size={14} />}
            label={`${selectedJob?.applicantCount ?? 0} applicants loaded`}
          />
          <InfoChip
            icon={<Shield size={14} />}
            label={screeningState.biasDetection ? "Bias detection on" : "Bias detection off"}
          />
          <InfoChip icon={<Cpu size={14} />} label={selectedJob?.title ?? "Selected role"} />
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <XCircle size={16} />
          Back to Configuration
        </button>
      </div>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs text-gray-500">
      {icon}
      <span>{label}</span>
    </div>
  );
}
