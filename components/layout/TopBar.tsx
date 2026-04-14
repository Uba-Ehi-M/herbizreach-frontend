"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/products/new": "New product",
  "/analytics": "Analytics",
  "/leads": "Leads",
  "/chat": "Messages",
  "/settings": "Store settings",
};

function titleForPath(path: string): string {
  if (path.startsWith("/products/") && path !== "/products/new") {
    return "Edit product";
  }
  return titles[path] ?? "HerBizReach";
}

export function TopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const mobileTitle = titleForPath(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--bg-base)]/95 px-4 backdrop-blur-md md:h-16 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <BrandLogo
          href="/dashboard"
          heightClass="h-9 md:h-10"
          wordmarkClassName="text-[var(--text-primary)] md:text-xl"
          className="shrink-0"
        />
        {pathname !== "/dashboard" ? (
          <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text-primary)] md:hidden">
            {mobileTitle}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5 text-[var(--text-muted)]" />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full border border-[var(--border-default)]"
              aria-label="Account"
            >
              <span className="text-xs font-bold text-[var(--brand-primary)]">
                {user?.fullName?.slice(0, 1).toUpperCase() ?? "?"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs text-[var(--text-muted)]">{user?.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
