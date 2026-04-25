import { baseApi } from "./base-api";
import type {
  ApplicantsResponse,
  Job,
  JobsResponse,
  ScreeningResultsResponse,
} from "@/lib/api-types";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, void>({
      query: () => "/jobs",
      providesTags: ["Jobs"],
    }),
    getSeekerJobs: builder.query<JobsResponse, void>({
      query: () => "/jobs/seeker/browse",
      providesTags: ["Jobs"],
    }),
    getApplicants: builder.query<ApplicantsResponse, string>({
      query: (jobId) => `/jobs/${jobId}/applicants`,
      providesTags: ["Applicants"],
    }),
    getScreeningResults: builder.query<ScreeningResultsResponse, string>({
      query: (jobId) => `/jobs/${jobId}/screening/results`,
      providesTags: ["Screening"],
    }),
    createJob: builder.mutation<{ message: string; item: Job }, Partial<Job>>({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    uploadApplicants: builder.mutation<
      {
        message: string;
        parsingStatus: string;
        preview: Array<{
          id: string;
          fullName: string;
          email?: string;
          yearsExperience: number;
          skills: string[];
        }>;
      },
      { jobId: string; files: File[] }
    >({
      query: ({ jobId, files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return {
          url: `/jobs/${jobId}/applicants/upload`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Applicants"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetApplicantsQuery,
  useGetJobsQuery,
  useGetSeekerJobsQuery,
  useGetScreeningResultsQuery,
  useUploadApplicantsMutation,
} = jobsApi;
