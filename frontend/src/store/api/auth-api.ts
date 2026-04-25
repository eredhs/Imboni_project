import { baseApi } from "./base-api";
import type { User } from "@/lib/api-types";

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      AuthResponse,
      {
        email: string;
        password: string;
        role?: "recruiter" | "job_seeker" | "system_controller";
      }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<
      AuthResponse,
      {
        name: string;
        email: string;
        password: string;
        organization: string;
        location?: string;
        role?: "recruiter" | "job_seeker" | "system_controller";
      }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
