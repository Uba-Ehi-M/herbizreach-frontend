"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { OwnerSidebar } from "@/components/layout/OwnerSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useOwnerInboxSocket } from "@/hooks/useOwnerInboxSocket";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

export default function OwnerLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
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
    if (role !== "OWNER") {
      router.replace("/");
    }
  }, [mounted, token, role, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <div className="size-10 animate-spin rounded-full border-2 border-[var(--brand-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!token || role !== "OWNER") {
    return null;
  }

  return <OwnerShell>{children}</OwnerShell>;
}

function OwnerInboxSocketBridge() {
  useOwnerInboxSocket();
  return null;
}

function OwnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideMobileTopBar = pathname === "/dashboard";
  const isChat = pathname === "/chat";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-20 md:pb-0 md:pl-60">
      <OwnerInboxSocketBridge />
      <OwnerSidebar />
      <div className={cn(hideMobileTopBar && "hidden md:block")}>
        <TopBar />
      </div>
      <main
        className={cn(
          "px-4 py-6 md:ml-0 md:px-8 md:py-8",
          hideMobileTopBar && "pt-0 md:pt-8",
          isChat && "px-0 py-0 md:px-8 md:py-8",
        )}
      >
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
