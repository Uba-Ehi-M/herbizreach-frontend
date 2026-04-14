"use client";

import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore, type ThemeMode } from "@/stores/useThemeStore";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const cycle: { mode: ThemeMode; label: string; icon: ReactNode }[] = [
    { mode: "light", label: "Light", icon: <Sun className="size-4" /> },
    { mode: "dark", label: "Dark", icon: <Moon className="size-4" /> },
    { mode: "system", label: "System", icon: <Monitor className="size-4" /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Theme"
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {cycle.map((c) => (
          <DropdownMenuItem
            key={c.mode}
            onClick={() => setTheme(c.mode)}
            className={theme === c.mode ? "bg-[var(--bg-muted)]" : ""}
          >
            <span className="mr-2">{c.icon}</span>
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
