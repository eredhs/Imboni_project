import { baseApi } from "./base-api";

export type DashboardOverview = {
  activeJobs: number;
  closingThisWeek: number;
  pendingScreenings: number;
  shortlistedToday: number;
  shortlistRoles: number;
  timeSavedHours: number;
  optimizationSuggestion?: {
    title: string;
    text: string;
  };
  recentScreenings: Array<{
    id: string;
    jobTitle: string;
    applicants: number;
    topScore: number;
    status: "completed" | "in_progress" | "pending";
  }>;
  poolIntelligence: {
    text: string;
    skillStrength: string;
    marketFitPercentile: string;
    updatedMinutesAgo: number;
  };
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => "/dashboard/overview",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
