"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import { selectJob, setStep } from "@/store/screening-slice";
import { StepProgressBar } from "./step-progress-bar";
import { StepOneJobSelection } from "./step-one-job-selection";
import { StepTwoCandidateReview } from "./step-two-candidate-review";
import { StepThreeConfigureParameters } from "./step-three-configure-parameters";
import { StepFourRunning } from "./step-four-running";
import { StepFiveResults } from "./step-five-results";
import type { RootState } from "@/store";

interface ScreeningWizardProps {
  initialJobId?: string;
}

export function ScreeningWizard({ initialJobId }: ScreeningWizardProps) {
  const dispatch = useDispatch();
  const screeningState = useSelector((state: RootState) => state.screening);
  const { data: jobsData } = useGetJobsQuery();

  useEffect(() => {
    if (!initialJobId || !jobsData?.items?.length) {
      return;
    }

    const job = jobsData.items.find((item) => item.id === initialJobId);
    if (!job) {
      return;
    }

    if (screeningState.selectedJobId !== job.id) {
      dispatch(selectJob(job));
    }
  }, [dispatch, initialJobId, jobsData?.items, screeningState.selectedJobId]);

  useEffect(() => {
    if (!screeningState.selectedJobId && screeningState.step !== 1) {
      dispatch(setStep(1));
    }
  }, [dispatch, screeningState.selectedJobId, screeningState.step]);

  return (
    <div className="min-h-screen bg-white">
      <StepProgressBar currentStep={screeningState.step} />

      <div className="px-6 pb-8">
        {screeningState.step === 1 ? <StepOneJobSelection /> : null}
        {screeningState.step === 2 ? <StepTwoCandidateReview /> : null}
        {screeningState.step === 3 ? <StepThreeConfigureParameters /> : null}
        {screeningState.step === 4 ? <StepFourRunning /> : null}
        {screeningState.step === 5 ? <StepFiveResults /> : null}
      </div>
    </div>
  );
}
