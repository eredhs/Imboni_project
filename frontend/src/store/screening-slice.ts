import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Job } from "@/lib/api-types";

export type ScreeningStep = 1 | 2 | 3 | 4 | 5;
export type ScreeningStatus = "idle" | "running" | "complete" | "failed" | "cancelled";

export interface BiasAlert {
  detected: boolean;
  level: "low" | "moderate" | "high";
  message: string;
}

export interface ScreeningResult {
  id: string;
  name: string;
  role: string;
  score: number;
  skills: string[];
  confidence: "high" | "medium" | "low" | "uncertain";
  gaps?: string[];
  aiRationale: string;
}

export interface ScreeningState {
  step: ScreeningStep;
  selectedJobId: string | null;
  selectedJob: Job | null;
  candidatePool: any[];
  weights: {
    skills: number;
    experience: number;
    communication: number;
    culture: number;
  };
  confidenceThreshold: number;
  skillPriorities: Record<string, "low" | "medium" | "high">;
  biasDetection: boolean;
  autoRescreen: boolean;
  runId: string | null;
  status: ScreeningStatus;
  progress: { done: number; total: number };
  results: ScreeningResult[];
  biasAlert: BiasAlert | null;
  poolIntelligence: string | null;
}

const initialState: ScreeningState = {
  step: 1,
  selectedJobId: null,
  selectedJob: null,
  candidatePool: [],
  weights: {
    skills: 40,
    experience: 25,
    communication: 20,
    culture: 15,
  },
  confidenceThreshold: 75,
  skillPriorities: {},
  biasDetection: true,
  autoRescreen: false,
  runId: null,
  status: "idle",
  progress: { done: 0, total: 0 },
  results: [],
  biasAlert: null,
  poolIntelligence: null,
};

export const screeningSlice = createSlice({
  name: "screening",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ScreeningStep>) => {
      state.step = action.payload;
    },
    selectJob: (state, action: PayloadAction<Job>) => {
      state.selectedJobId = action.payload.id;
      state.selectedJob = action.payload;
    },
    updateWeight: (
      state,
      action: PayloadAction<{ key: keyof ScreeningState["weights"]; value: number }>
    ) => {
      const { key, value } = action.payload;
      state.weights[key] = Math.min(100, Math.max(0, value));
    },
    setThreshold: (state, action: PayloadAction<number>) => {
      state.confidenceThreshold = action.payload;
    },
    setSkillPriority: (
      state,
      action: PayloadAction<{ skill: string; level: "low" | "medium" | "high" }>
    ) => {
      state.skillPriorities[action.payload.skill] = action.payload.level;
    },
    toggleBiasDetection: (state) => {
      state.biasDetection = !state.biasDetection;
    },
    toggleAutoRescreen: (state) => {
      state.autoRescreen = !state.autoRescreen;
    },
    startRun: (state, action: PayloadAction<string>) => {
      state.runId = action.payload;
      state.status = "running";
      state.step = 4;
    },
    updateProgress: (
      state,
      action: PayloadAction<{ done: number; total: number; status: ScreeningStatus }>
    ) => {
      state.progress = { done: action.payload.done, total: action.payload.total };
      state.status = action.payload.status;
    },
    completeRun: (
      state,
      action: PayloadAction<{
        results: ScreeningResult[];
        biasAlert: BiasAlert | null;
        poolIntelligence: string | null;
      }>
    ) => {
      state.results = action.payload.results;
      state.biasAlert = action.payload.biasAlert;
      state.poolIntelligence = action.payload.poolIntelligence;
      state.status = "complete";
      state.step = 5;
    },
    cancelRun: (state) => {
      state.status = "cancelled";
      state.runId = null;
    },
    resetWizard: (state) => {
      state.step = 1;
      state.selectedJobId = null;
      state.selectedJob = null;
      state.status = "idle";
      state.runId = null;
      state.progress = { done: 0, total: 0 };
      state.results = [];
      state.biasAlert = null;
    },
  },
});

export const {
  setStep,
  selectJob,
  updateWeight,
  setThreshold,
  setSkillPriority,
  toggleBiasDetection,
  toggleAutoRescreen,
  startRun,
  updateProgress,
  completeRun,
  cancelRun,
  resetWizard,
} = screeningSlice.actions;

export const screeningReducer = screeningSlice.reducer;
