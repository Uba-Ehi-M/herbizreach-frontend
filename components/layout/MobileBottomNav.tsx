"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { ownerNav } from "./nav-config";

export function MobileBottomNav() {
  const pathname = usePathname();
  const unreadByConversation = useChatStore((s) => s.unreadByConversation);
  const totalUnread = Object.values(unreadByConversation).reduce((a, b) => a + b, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-center border-t border-[var(--border-default)] bg-[var(--bg-card)] px-2 pb-safe shadow-[var(--shadow-md)] md:hidden">
      <div className="flex w-full max-w-lg justify-around">
        {ownerNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showDot = item.href === "/chat" && totalUnread > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-2 text-[10px] font-medium",
                active ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]",
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
              {showDot ? (
                <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold leading-none text-white">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
