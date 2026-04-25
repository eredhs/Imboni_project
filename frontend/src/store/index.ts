import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth-slice";
import { screeningReducer } from "./screening-slice";
import uiReducer from "./ui-slice";
import { baseApi } from "./api/base-api";
import { applicationsApi } from "./api/applications-api";
import { adminApi } from "./api/admin-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    screening: screeningReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(applicationsApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
