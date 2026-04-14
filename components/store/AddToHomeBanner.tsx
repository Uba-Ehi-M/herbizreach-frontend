"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "herbizreach_pwa_banner_dismissed";

export function AddToHomeBanner(props: { storeSlug: string }) {
  const { storeSlug } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;
    setVisible(true);
  }, [storeSlug]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "border-b border-[var(--border-default)] bg-[var(--brand-glow)] px-4 py-2.5",
        "text-center text-sm text-[var(--text-secondary)]",
      )}
      role="region"
      aria-label="Install app"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <p className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
          <Download className="size-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
          Add this store to your home screen for quick access (Share → Add to Home Screen on iPhone).
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 shrink-0 text-xs"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
            setVisible(false);
          }}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
