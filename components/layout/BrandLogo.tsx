"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO = "/herbizreach-logo.png";

type BrandLogoProps = {
  className?: string;
  /** Tailwind height classes for the mark (e.g. h-10 md:h-11) */
  heightClass?: string;
  href?: string;
  /** Extra classes on the outer Link when `href` is set */
  linkClassName?: string;
  priority?: boolean;
  /** Show “HerBizReach” beside the mark (set false if the PNG is already a full wordmark) */
  showWordmark?: boolean;
  /** Text color / size overrides for the wordmark */
  wordmarkClassName?: string;
  /** Subtle panel behind the mark only (not the wordmark) */
  withLightPanel?: boolean;
};

export function BrandLogo({
  className,
  heightClass = "h-10 md:h-11",
  href,
  linkClassName,
  priority,
  showWordmark = true,
  wordmarkClassName,
  withLightPanel,
}: BrandLogoProps) {
  const mark = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        withLightPanel &&
          "rounded-lg bg-white/95 px-2 py-1.5 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10",
      )}
    >
      <Image
        src={LOGO}
        alt={showWordmark ? "" : "HerBizReach"}
        width={200}
        height={56}
        priority={priority}
        aria-hidden={showWordmark}
        className={cn(
          "h-auto w-auto object-contain object-left",
          showWordmark ? "max-h-[2.5rem] sm:max-h-[2.75rem] md:max-h-[3.25rem]" : "max-w-[min(100%,14rem)]",
          heightClass,
          className,
        )}
      />
    </span>
  );

  const inner = (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2 sm:gap-2.5">
      {mark}
      {showWordmark ? (
        <span
          className={cn(
            "min-w-0 truncate font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--text-primary)]",
            "text-base sm:text-lg md:text-xl",
            wordmarkClassName,
          )}
        >
          HerBizReach
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex min-w-0 shrink-0 items-center", linkClassName)}
        aria-label="HerBizReach home"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
