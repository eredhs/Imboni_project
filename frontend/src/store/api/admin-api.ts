import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const apiBaseUrl = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

export interface AdminStats {
  platformStats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalUsers: number;
    avgApplicationsPerJob: number;
  };
  jobBreakdown: Array<{
    jobId: string;
    title: string;
    department: string;
    status: string;
    applications: number;
  }>;
}

export interface PlatformInsights {
  insights: {
    jobsByStatus: Record<string, number>;
    jobsByDepartment: Record<string, number>;
    totalActive: number;
    closingThisWeek: number;
  };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("talentlens_access_token")
          : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["AdminStats"],
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
    getPlatformInsights: builder.query<PlatformInsights, void>({
      query: () => ({
        url: "/admin/insights",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetPlatformInsightsQuery } = adminApi;
