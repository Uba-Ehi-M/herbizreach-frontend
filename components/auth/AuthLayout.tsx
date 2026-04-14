"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Sparkles, Store } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sparkles,
    title: "AI that sells",
    text: "Turn rough notes into warm, professional descriptions in seconds.",
  },
  {
    icon: Store,
    title: "One link, full catalog",
    text: "Share a single storefront anywhere — bio, status, DMs, or flyers.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-first",
    text: "Let buyers message you on the channel they already trust.",
  },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)] md:flex-row">
      <aside className="relative hidden overflow-hidden md:flex md:min-h-screen md:w-[min(58vw,800px)] md:min-w-[min(100%,580px)] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-[var(--border-default)] md:px-12 md:py-12 lg:w-[min(54vw,840px)] lg:min-w-[640px] lg:px-14 lg:py-14 xl:min-w-[700px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[var(--brand-primary)]"
          style={{
            background:
              "conic-gradient(from 210deg at 20% 30%, rgba(124,58,237,0.95), rgba(109,40,217,0.98) 35%, rgba(167,139,250,0.85) 70%, rgba(124,58,237,0.92))",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 85%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 90% 15%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/95 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/15"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Back to home
            </Link>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 py-8 text-center">
            <div className="mx-auto max-w-[22rem] space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Women-led business toolkit
              </p>
              <div className="flex justify-center">
                <BrandLogo href="/" heightClass="h-14 lg:h-16" withLightPanel priority />
              </div>
              <h1 className="sr-only">HerBizReach</h1>
              <p className="text-base leading-relaxed text-white/88 lg:text-lg">
                Your business, seen by more. Share your catalog, sharpen your copy with AI, and meet
                customers on WhatsApp — built for bold SMEs across Africa.
              </p>
            </div>

            <ul className="mx-auto flex w-full max-w-md flex-col gap-5">
              {highlights.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="rounded-[var(--radius-lg)] border border-white/15 bg-white/10 px-5 py-4 text-center backdrop-blur-sm"
                >
                  <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-white/15 text-white shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="font-[family-name:var(--font-display)] text-sm font-bold text-white">
                    {title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/82">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex shrink-0 flex-col items-center border-t border-white/15 pt-8 text-center">
            <p className="max-w-xs text-xs leading-relaxed text-white/65">
              Women in Tech Hackathon 2026
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-h-screen flex-1 flex-col bg-[var(--bg-subtle)]">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3 md:hidden">
          <BrandLogo href="/" heightClass="h-9" />
          <ThemeToggle />
        </div>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 md:px-8 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AuthBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" className="mb-6 -ml-2 min-h-10 w-fit text-[var(--text-muted)] hover:text-[var(--text-primary)]">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
