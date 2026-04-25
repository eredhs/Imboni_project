import { baseApi } from "./base-api";
import type { ShortlistCandidate } from "@/lib/api-types";

export type CandidateDetail = Omit<ShortlistCandidate, "notes"> & {
  candidateProfile?: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    linkedinUrl?: string;
    portfolioUrl?: string;
    expectedSalary?: string;
    availableFrom?: string;
    workAuthorization?: string;
    professionalSummary?: string;
  };
  resume?: {
    fileName: string;
    mimeType: string;
    fileSize: number;
    url: string;
    extractedText?: string;
  };
  notes: Array<{
    id: string;
    recruiterName: string;
    text: string;
    createdAt: string;
  }>;
};

export const screeningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    triggerScreening: builder.mutation<
      { runId: string; jobId: string; status: string },
      {
        jobId: string;
        weights: {
          skills: number;
          experience: number;
          communication: number;
          culture: number;
        };
        biasDetection: boolean;
        shortlistSize: 10 | 20;
      }
    >({
      query: ({ jobId, ...body }) => ({
        url: `/jobs/${jobId}/screening/trigger`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Screening"],
    }),
    getScreeningStatus: builder.query<
      {
        runId?: string;
        jobId?: string;
        status: string;
        progress: number;
        message: string;
        redirectTo?: string | null;
      },
      { jobId: string; runId: string }
    >({
      query: ({ jobId, runId }) => `/jobs/${jobId}/screening/status?runId=${runId}`,
      providesTags: ["Screening"],
    }),
    getCandidateDetail: builder.query<CandidateDetail, string>({
      query: (candidateId) => `/candidates/${candidateId}/detail`,
      providesTags: (_result, _error, candidateId) => [
        { type: "Candidate", id: candidateId },
      ],
    }),
    addCandidateNote: builder.mutation<
      { id: string; recruiterName: string; text: string; createdAt: string },
      { candidateId: string; text: string }
    >({
      query: ({ candidateId, text }) => ({
        url: `/candidates/${candidateId}/notes`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, payload) => [
        { type: "Candidate", id: payload.candidateId },
      ],
    }),
    updateCandidateAction: builder.mutation<
      { id: string; action: "approved" | "rejected" | "flagged" },
      { candidateId: string; action: "approved" | "rejected" | "flagged" }
    >({
      query: ({ candidateId, action }) => ({
        url: `/screening-results/${candidateId}/action`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: (_result, _error, payload) => [
        { type: "Candidate", id: payload.candidateId },
        "Screening",
      ],
    }),
    compareCandidates: builder.mutation<
      { candidates: ShortlistCandidate[]; aiRecommendation: string },
      { jobId: string; candidateIds: string[] }
    >({
      query: ({ jobId, candidateIds }) => ({
        url: `/jobs/${jobId}/screening/compare`,
        method: "POST",
        body: { candidateIds },
      }),
    }),
  }),
});

export const {
  useAddCandidateNoteMutation,
  useCompareCandidatesMutation,
  useGetCandidateDetailQuery,
  useGetScreeningStatusQuery,
  useTriggerScreeningMutation,
  useUpdateCandidateActionMutation,
} = screeningApi;
