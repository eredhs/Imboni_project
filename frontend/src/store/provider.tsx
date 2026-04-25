"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { hydrateTokens } from "./auth-slice";
import { Toaster } from "react-hot-toast";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    store.dispatch(
      hydrateTokens({
        accessToken: window.localStorage.getItem("talentlens_access_token"),
        refreshToken: window.localStorage.getItem("talentlens_refresh_token"),
      }),
    );
    setIsHydrated(true);
  }, []);

  return (
    <Provider store={store}>
      {isHydrated ? children : null}
      <Toaster position="top-right" />
    </Provider>
  );
}
