import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const baseUrl = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const accessToken = window.localStorage.getItem("talentlens_access_token");
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    typeof window !== "undefined" &&
    typeof result.error === "object" &&
    result.error &&
    "status" in result.error &&
    result.error.status === 401
  ) {
    const refreshToken = window.localStorage.getItem("talentlens_refresh_token");

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (
        typeof refreshResult.data === "object" &&
        refreshResult.data &&
        "accessToken" in refreshResult.data
      ) {
        window.localStorage.setItem(
          "talentlens_access_token",
          String(refreshResult.data.accessToken),
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        window.localStorage.removeItem("talentlens_access_token");
        window.localStorage.removeItem("talentlens_refresh_token");
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Dashboard",
    "Jobs",
    "Applicants",
    "Candidate",
    "Screening",
    "Reports",
    "Settings",
    "Moderation",
  ],
  endpoints: () => ({}),
});
