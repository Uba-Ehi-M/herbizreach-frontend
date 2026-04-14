"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AdminSidebarDesktop, AdminSidebarMobileTrigger } from "@/components/admin/AdminSidebar";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminLayout({ children }: { children: ReactNode }) {
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
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <AdminSidebarDesktop />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--bg-card)]/95 px-4 backdrop-blur-md md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <AdminSidebarMobileTrigger />
            <Link
              href="/admin"
              className="flex min-w-0 items-center gap-2 font-[family-name:var(--font-display)] font-bold text-[var(--brand-primary)]"
            >
              <BrandLogo
                heightClass="h-8 md:h-9"
                wordmarkClassName="text-base md:text-lg text-[var(--brand-primary)]"
              />
              <span className="hidden shrink-0 text-[var(--text-secondary)] sm:inline">Admin</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
