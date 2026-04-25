import { baseApi } from "./base-api";
import type { SettingsData } from "@/lib/api-types";

export interface ScoringWeights {
  skills: number;
  experience: number;
  communication: number;
  cultureFit: number;
}

export interface NotificationPreferences {
  emailOnApplication: boolean;
  emailOnScreeningComplete: boolean;
  emailOnShortlist: boolean;
  emailOnOffer: boolean;
  slackIntegration: boolean;
}

export interface BiasDetectionSettings {
  enableRealTimeAlerts: boolean;
  educationUniformityGuard: boolean;
  experienceClustering: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "admin" | "reviewer" | "viewer";
  joinedAt: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ success: boolean; data: SettingsData }, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<{ success: boolean; data: SettingsData }, Partial<SettingsData>>({
      query: (body) => ({
        url: "/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateScoringWeights: builder.mutation<{ success: boolean; data: ScoringWeights }, Partial<ScoringWeights>>({
      query: (weights) => ({
        url: "/settings/scoring",
        method: "PATCH",
        body: { weights },
      }),
      invalidatesTags: ["Settings"],
    }),
    updateNotifications: builder.mutation<{ success: boolean; data: NotificationPreferences }, Partial<NotificationPreferences>>({
      query: (preferences) => ({
        url: "/settings/notifications",
        method: "PATCH",
        body: { preferences },
      }),
      invalidatesTags: ["Settings"],
    }),
    updateBiasDetection: builder.mutation<{ success: boolean; data: BiasDetectionSettings }, Partial<BiasDetectionSettings>>({
      query: (settings) => ({
        url: "/settings/bias-detection",
        method: "PATCH",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
    getTeamMembers: builder.query<{ success: boolean; data: TeamMember[] }, void>({
      query: () => "/settings/team",
      providesTags: ["Settings"],
    }),
    addTeamMember: builder.mutation<
      { success: boolean; data: TeamMember },
      { email: string; name: string; role: "admin" | "reviewer" | "viewer" }
    >({
      query: (member) => ({
        url: "/settings/team",
        method: "POST",
        body: member,
      }),
      invalidatesTags: ["Settings"],
    }),
    removeTeamMember: builder.mutation<{ success: boolean; data: TeamMember[] }, string>({
      query: (memberId) => ({
        url: `/settings/team/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateScoringWeightsMutation,
  useUpdateNotificationsMutation,
  useUpdateBiasDetectionMutation,
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} = settingsApi;
