"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  ScrollText,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/conversations", label: "Chats", icon: MessageSquare, exact: false },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText, exact: false },
] as const;

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Admin">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--brand-glow)] text-[var(--brand-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            <Icon className="size-5 shrink-0 opacity-90" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebarMobileTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex flex-col gap-6 p-0">
          <div className="flex items-center gap-2 border-b border-[var(--border-default)] px-4 py-4">
            <ClipboardList className="size-6 shrink-0 text-[var(--brand-primary)]" aria-hidden />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--brand-primary)]">
              Admin
            </span>
          </div>
          <div className="px-3 pb-6">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AdminSidebarDesktop() {
  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col border-r border-[var(--border-default)] bg-[var(--bg-card)] lg:flex"
      aria-label="Admin navigation"
    >
      <div className="flex h-14 items-center gap-2 border-b border-[var(--border-default)] px-4">
        <ClipboardList className="size-6 shrink-0 text-[var(--brand-primary)]" aria-hidden />
        <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--brand-primary)]">
          Console
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavLinks />
      </div>
    </aside>
  );
}
