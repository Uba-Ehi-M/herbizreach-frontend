import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | null | undefined,
): string {
  if (amount == null || amount === "") return "₦0";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (typeof n !== "number" || !Number.isFinite(n)) return "₦0";
  const isWhole = Math.abs(n - Math.round(n)) < 0.001;
  return `₦${n.toLocaleString("en-NG", {
    maximumFractionDigits: isWhole ? 0 : 2,
    minimumFractionDigits: 0,
  })}`;
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Short labels for chat conversation rows (today / yesterday / weekday / date). */
export function formatChatListTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startToday - startMsg) / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString("en-NG", { weekday: "short" });
  }
  return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "there";
}
