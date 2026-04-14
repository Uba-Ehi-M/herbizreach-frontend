"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { ownerNav, ownerNavExtra } from "./nav-config";

export function OwnerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-[var(--border-default)] bg-[var(--bg-card)] pt-16 transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex flex-1 flex-col gap-1 p-2">
        {!collapsed ? (
          <div className="mb-2 border-b border-[var(--border-default)] px-1 pb-3">
            <BrandLogo href="/dashboard" heightClass="h-9" wordmarkClassName="text-base" />
          </div>
        ) : null}
        {[...ownerNav, ...ownerNavExtra].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--brand-glow)] text-[var(--brand-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed ? item.label : null}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-[var(--border-default)] p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
        </Button>
      </div>
    </aside>
  );
}
