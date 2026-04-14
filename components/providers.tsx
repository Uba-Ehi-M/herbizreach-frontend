"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { setAuthCookie } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      let resolved: "light" | "dark" = "light";
      if (theme === "dark") resolved = "dark";
      else if (theme === "light") resolved = "light";
      else resolved = mq.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return null;
}

function AuthCookieSync() {
  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (token) {
      setAuthCookie(token);
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <AuthCookieSync />
      {children}
      <Toaster richColors position="top-center" closeButton />
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
