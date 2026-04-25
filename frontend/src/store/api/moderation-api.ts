import { baseApi } from "./base-api";

export interface ModerationActivity {
  id: string;
  type: "job_posted" | "application_received" | "placement";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  user?: string;
}

export interface ModerationStats {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
}

export interface ModerationDashboardResponse {
  success: boolean;
  stats: ModerationStats;
  activities: ModerationActivity[];
}

export interface ActivitiesResponse {
  success: boolean;
  data: ModerationActivity[];
}

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<ModerationDashboardResponse, void>({
      query: () => "/moderation/dashboard",
      providesTags: ["Moderation"],
    }),
    getActivities: builder.query<ActivitiesResponse, void>({
      query: () => "/moderation/activities",
      providesTags: ["Moderation"],
    }),
  }),
});

export const { useGetDashboardQuery, useGetActivitiesQuery } = moderationApi;
