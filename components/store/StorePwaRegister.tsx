"use client";

import { useEffect } from "react";

/**
 * Registers a minimal service worker so Chrome/Android can treat the storefront as installable.
 */
export function StorePwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/hbr-sw.js").catch(() => {
      /* ignore — dev / unsupported */
    });
  }, []);

  return null;
}
