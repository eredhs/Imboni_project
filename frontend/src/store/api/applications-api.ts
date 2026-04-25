import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Application, Notification } from "@/lib/api-types";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const apiBaseUrl = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
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
  }),
  tagTypes: ["Application", "Notification"],
  endpoints: (builder) => ({
    // Apply to job
    applyToJob: builder.mutation<
      { success: boolean; data: Application; message: string },
      {
        jobId: string;
        userId: string;
        hrId: string;
        coverLetter?: string;
        resumeUrl?: string;
        fullName: string;
        email: string;
        phone?: string;
        location?: string;
        currentRole?: string;
        yearsOfExperience?: string;
        linkedinUrl?: string;
        portfolioUrl?: string;
        expectedSalary?: string;
        availableFrom?: string;
        workAuthorization?: string;
        professionalSummary?: string;
        cv?: File | null;
      }
    >({
      query: ({ jobId, cv, ...body }) => {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        if (cv) {
          formData.append("cv", cv);
        }
        return {
          url: `/applications/${jobId}/apply`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Application"],
    }),

    // Get applications by job (for HR)
    getApplicationsByJob: builder.query<
      { success: boolean; data: Application[]; count: number },
      string
    >({
      query: (jobId) => `/applications/job/${jobId}`,
      providesTags: ["Application"],
    }),

    // Get applications by user (for job seeker)
    getApplicationsByUser: builder.query<
      { success: boolean; data: Application[]; count: number },
      string
    >({
      query: (userId) => `/applications/user/${userId}`,
      providesTags: ["Application"],
    }),

    // Get application detail
    getApplicationDetail: builder.query<
      { success: boolean; data: Application },
      string
    >({
      query: (applicationId) => `/applications/${applicationId}`,
      providesTags: ["Application"],
    }),

    // Update application status
    updateApplicationStatus: builder.mutation<
      { success: boolean; data: Application; message: string },
      { applicationId: string; status: string; reason?: string }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Application", "Notification"],
    }),

    // Add application note
    addApplicationNote: builder.mutation<
      { success: boolean; data: Application; message: string },
      { applicationId: string; note: string }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/applications/${applicationId}/notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application"],
    }),

    // Schedule interview
    scheduleInterview: builder.mutation<
      { success: boolean; data: Application; message: string },
      { applicationId: string; dateTime: string }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/applications/${applicationId}/interview`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application", "Notification"],
    }),

    // Extend offer
    extendOffer: builder.mutation<
      { success: boolean; data: Application; message: string },
      { applicationId: string; salary: number; startDate: string; benefits: string[] }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/applications/${applicationId}/offer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application", "Notification"],
    }),

    // Get notifications
    getNotifications: builder.query<
      { success: boolean; data: Notification[]; unreadCount: number },
      string
    >({
      query: (userId) => `/applications/notifications/${userId}`,
      providesTags: ["Notification"],
    }),

    // Mark notification as read
    markNotificationRead: builder.mutation<
      { success: boolean; message: string },
      { userId: string; notificationId: string }
    >({
      query: ({ userId, notificationId }) => ({
        url: `/applications/notifications/${userId}/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (userId) => ({
        url: `/applications/notifications/${userId}/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useApplyToJobMutation,
  useGetApplicationsByJobQuery,
  useGetApplicationsByUserQuery,
  useGetApplicationDetailQuery,
  useUpdateApplicationStatusMutation,
  useAddApplicationNoteMutation,
  useScheduleInterviewMutation,
  useExtendOfferMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = applicationsApi;
