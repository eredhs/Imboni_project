import { baseApi } from "./base-api";
import type {
  BiasHistoryItem,
  ReportsOverview,
  SkillFrequency,
  TimelinePoint,
} from "@/lib/api-types";

type ReportsPayload = {
  kpis: ReportsOverview;
  screeningsTimeline: TimelinePoint[];
  skillsFrequency: SkillFrequency[];
  outcomes: ReportsOverview["outcomes"];
  biasHistory: BiasHistoryItem[];
};

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportsOverview: builder.query<ReportsPayload, void>({
      query: () => "/reports/overview",
      providesTags: ["Reports"],
    }),
    getScreeningsTimeline: builder.query<TimelinePoint[], void>({
      query: () => "/reports/screenings-timeline",
      providesTags: ["Reports"],
    }),
    getSkillsFrequency: builder.query<SkillFrequency[], void>({
      query: () => "/reports/skills-frequency",
      providesTags: ["Reports"],
    }),
    getBiasHistory: builder.query<BiasHistoryItem[], void>({
      query: () => "/reports/bias-history",
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetBiasHistoryQuery,
  useGetReportsOverviewQuery,
  useGetScreeningsTimelineQuery,
  useGetSkillsFrequencyQuery,
} = reportsApi;
