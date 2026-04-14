"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [mounted, token, role, router]);

  if (!mounted || !token || role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <div className="size-10 animate-spin rounded-full border-2 border-[var(--brand-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="flex h-14 items-center justify-between border-b border-[var(--border-default)] px-4 md:px-8">
        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-2 font-[family-name:var(--font-display)] font-bold text-[var(--brand-primary)]"
        >
          <BrandLogo heightClass="h-8 md:h-9" wordmarkClassName="text-base md:text-lg text-[var(--brand-primary)]" />
          <span className="shrink-0 text-[var(--text-secondary)]">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="secondary"
            className="min-h-10"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            Log out
          </Button>
        </div>
      </header>
      <main className="px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
