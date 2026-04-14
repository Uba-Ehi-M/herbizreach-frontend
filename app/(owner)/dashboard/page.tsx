"use client";

import {
  ArrowUpRight,
  Bell,
  Copy,
  Eye,
  Link2,
  MoreVertical,
  RefreshCw,
  Send,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useLeads } from "@/hooks/useLeads";
import { useDuplicateProduct, useProducts } from "@/hooks/useProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useAuthStore } from "@/stores/useAuthStore";
import { firstName, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.types";
import { normalizeWaMeDigits } from "@/lib/ng-whatsapp-phone";
import { cn } from "@/lib/utils";

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-NG");
}

function trendFromDaily(daily: { count: number }[]): { pct: number; up: boolean } | null {
  if (daily.length < 2) return null;
  const mid = Math.max(1, Math.floor(daily.length / 2));
  const first = daily.slice(0, mid).reduce((a, b) => a + b.count, 0);
  const second = daily.slice(mid).reduce((a, b) => a + b.count, 0);
  if (first === 0) return second > 0 ? { pct: 100, up: true } : null;
  const pct = Math.round(((second - first) / first) * 1000) / 10;
  return { pct: Math.abs(pct), up: pct >= 0 };
}

function waMeLink(phone: string | null | undefined, text: string): string | null {
  if (!phone?.trim()) return null;
  const digits = normalizeWaMeDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function DashboardMetricCard({
  label,
  value,
  icon: Icon,
  trend,
  iconBg,
  iconClassName,
  trendCompareSuffix = "vs last 7 days",
  periodHintWhenNoTrend = "vs last 7 days",
}: {
  label: string;
  value: string | number;
  icon: typeof Eye;
  trend: { pct: number; up: boolean } | null;
  iconBg: string;
  iconClassName: string;
  trendCompareSuffix?: string;
  periodHintWhenNoTrend?: string;
}) {
  return (
    <div className="min-w-[140px] shrink-0 snap-start rounded-2xl bg-[var(--bg-card)] p-3.5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-default)] md:min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", iconBg)}>
          <Icon className={cn("size-4", iconClassName)} />
        </div>
      </div>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        {value}
      </p>
      {trend ? (
        <p className="mt-1.5 text-xs">
          <span
            className={cn(
              "font-semibold",
              trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
            )}
          >
            {trend.up ? "↗" : "↘"} {trend.pct}%
          </span>
          <span className="text-[var(--text-muted)]"> {trendCompareSuffix}</span>
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">{periodHintWhenNoTrend}</p>
      )}
    </div>
  );
}

function DashboardMobileHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mb-6 flex items-center justify-between md:hidden">
      <BrandLogo
        href="/dashboard"
        withLightPanel
        heightClass="h-10"
        wordmarkClassName="text-white text-lg"
        linkClassName="text-white"
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full border border-white/40 bg-white/10 hover:bg-white/20"
              aria-label="Account"
            >
              <span className="text-xs font-bold text-white">
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
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, refetch, isFetching } = useAnalyticsOverview();
  const { data: leads } = useLeads();
  const { data: allProducts } = useProducts();
  const duplicateProduct = useDuplicateProduct({ navigateToEdit: false });
  const { data: storeSettings } = useStoreSettings();

  const views7d = data?.viewsLast7Days.reduce((a, b) => a + b.count, 0) ?? 0;
  const leadCount = leads?.length ?? 0;
  const trend = data?.viewsLast7Days ? trendFromDaily(data.viewsLast7Days) : null;
  const viewById = useMemo(
    () => new Map(data?.products.map((p) => [p.productId, p.pageViews]) ?? []),
    [data?.products],
  );
  const shareById = useMemo(
    () => new Map(data?.products.map((p) => [p.productId, p.shares]) ?? []),
    [data?.products],
  );

  const recentProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, [allProducts]);

  const shareMessage =
    user?.businessSlug && typeof window !== "undefined"
      ? `Check out my store on HerBizReach: ${window.location.origin}/store/${user.businessSlug}`
      : "Check out my store on HerBizReach!";
  const waHref = waMeLink(
    storeSettings?.whatsAppPhone ?? user?.phone ?? undefined,
    shareMessage,
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !data) {
    return <SectionError message="Could not load dashboard." onRetry={() => void refetch()} />;
  }

  const name = firstName(user?.fullName ?? "friend");

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero: Africa map is position:absolute so it layers beside copy (not stacked below the button). */}
      <div className="relative -mx-4 min-h-[200px] overflow-hidden rounded-b-[28px] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#a78bfa] px-4 pb-8 pt-4 text-white shadow-lg shadow-violet-900/20 md:mx-0 md:min-h-[240px] md:rounded-3xl md:px-8 md:pb-10 md:pt-6">
        <DashboardMobileHeader />

        {/* Text stays in flow; reserve right space on mobile so lines don’t sit under the graphic */}
        <div className="relative z-10 max-w-xl pb-2 pr-[42%] md:max-w-2xl md:pr-[min(340px,46%)]">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Welcome back, {name}{" "}
            <span className="inline-block" aria-hidden>
              👋
            </span>
          </h1>
          <p className="mt-2 text-base text-white/90 md:text-lg">
            Your business. Seen by more people. Powered by AI.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4 border-0 bg-white/15 text-white hover:bg-white/25"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh data
          </Button>
        </div>

        {/* Decorative map: out of document flow, anchored to hero */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 top-[4.25rem] z-0 w-[52%] max-w-[200px] sm:max-w-[220px] md:bottom-6 md:right-6 md:top-1/2 md:h-[min(300px,calc(100%-3rem))] md:w-[min(42vw,300px)] md:max-w-none md:-translate-y-1/2"
          aria-hidden
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.22),transparent_60%)]" />
            <Image
              src="/africa_purple.png"
              alt=""
              fill
              className="object-contain object-right-bottom drop-shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              sizes="(max-width: 768px) 200px, 300px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Metric strip — horizontal scroll on small phones */}
      <div className="-mx-1">
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <DashboardMetricCard
            label="Reach"
            value={formatCompact(views7d)}
            icon={Eye}
            trend={trend}
            iconBg="bg-violet-100 dark:bg-violet-500/20"
            iconClassName="text-violet-800 dark:text-violet-200"
            trendCompareSuffix="vs earlier this week"
            periodHintWhenNoTrend="Last 7 days · page views on your store"
          />
          <DashboardMetricCard
            label="Shares"
            value={formatCompact(data.totals.shares)}
            icon={Send}
            trend={trend}
            iconBg="bg-sky-100 dark:bg-sky-500/20"
            iconClassName="text-sky-800 dark:text-sky-200"
          />
          <DashboardMetricCard
            label="Leads"
            value={formatCompact(leadCount)}
            icon={Users}
            trend={trend}
            iconBg="bg-emerald-100 dark:bg-emerald-500/20"
            iconClassName="text-emerald-800 dark:text-emerald-200"
          />
          <DashboardMetricCard
            label="WhatsApp taps"
            value={formatCompact(data.totals.shares)}
            icon={Send}
            trend={trend}
            iconBg="bg-green-100 dark:bg-green-500/20"
            iconClassName="text-green-800 dark:text-green-200"
          />
        </div>
      </div>

      {/* Your products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
            Your products
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--brand-primary)] hover:underline"
          >
            View all &gt;
          </Link>
        </div>
        <div className="space-y-3">
          {recentProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-muted)]/50 px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No products yet.{" "}
              <Link href="/products/new" className="font-medium text-[var(--brand-primary)]">
                Add your first product
              </Link>
            </p>
          ) : (
            recentProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                views={viewById.get(p.id) ?? 0}
                shares={shareById.get(p.id) ?? 0}
                onDuplicate={() => duplicateProduct.mutate(p.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <ShareStoreQuickAction />
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] p-4 text-white shadow-md ring-1 ring-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold leading-snug">Message on WhatsApp</span>
              <Send className="size-5 shrink-0 opacity-90" />
            </div>
            <ArrowUpRight className="mt-6 size-5 self-end opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <Link
            href="/settings"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 text-[var(--text-primary)] shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold leading-snug">Add WhatsApp in settings</span>
              <Send className="size-5 shrink-0 text-[var(--text-muted)]" />
            </div>
            <ArrowUpRight className="mt-6 size-5 self-end text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            title="Engagement over time"
            description="Store and product views in the last 7 days."
          />
        </div>
        <EngagementChart data={data.viewsLast7Days} />
      </div>

      <div className="flex flex-wrap gap-2 md:flex">
        <Button asChild className="min-h-11">
          <Link href="/products/new">Add product</Link>
        </Button>
        <Button asChild variant="secondary" className="min-h-11">
          <Link href={user?.businessSlug ? `/store/${user.businessSlug}` : "/settings"}>
            View store
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ShareStoreQuickAction() {
  const slug = useAuthStore((s) => s.user?.businessSlug);

  return (
    <button
      type="button"
      onClick={() => {
        if (!slug) {
          window.location.href = "/settings";
          return;
        }
        const url = `${window.location.origin}/store/${slug}`;
        void navigator.clipboard.writeText(url).then(
          () => toast.success("Store link copied"),
          () => toast.error("Could not copy link"),
        );
      }}
      className="group flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#5b21b6] p-4 text-left text-white shadow-md ring-1 ring-white/10 transition hover:brightness-110"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug">Share store link</span>
        <Link2 className="size-5 shrink-0 opacity-90" aria-hidden />
      </div>
      <ArrowUpRight className="mt-6 size-5 self-end opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

function ProductRow({
  product: p,
  views,
  shares: _shares,
  onDuplicate,
}: {
  product: Product;
  views: number;
  shares: number;
  onDuplicate?: () => void;
}) {
  const businessSlug = useAuthStore((s) => s.user?.businessSlug);
  const desc = p.descriptionAi?.trim() || p.descriptionRaw?.trim() || "No description yet.";
  const short = desc.length > 72 ? `${desc.slice(0, 72)}…` : desc;
  const imageSrc = p.imageUrls?.[0]?.trim() ?? p.imageUrl?.trim() ?? "";

  return (
    <div className="flex overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
      <Link
        href={`/products/${p.id}`}
        className="relative w-[min(32%,7.5rem)] shrink-0 self-stretch min-h-[5.5rem] overflow-hidden bg-[var(--bg-muted)] sm:w-32"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 30vw, 128px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--text-muted)]">
            —
          </div>
        )}
        <span
          className={cn(
            "absolute left-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
            p.isPublished ? "bg-emerald-500 text-white" : "bg-neutral-500/90 text-white",
          )}
        >
          {p.isPublished ? "Live" : "Draft"}
        </span>
      </Link>
      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${p.id}`} className="min-w-0">
            <p className="font-semibold text-[var(--text-primary)]">{p.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">{short}</p>
            <p className="mt-1 text-sm font-bold text-[var(--brand-primary)]">{formatCurrency(p.price)}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{views} views</p>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0" aria-label="Product menu">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/products/${p.id}`}>Edit product</Link>
              </DropdownMenuItem>
              {onDuplicate ? (
                <DropdownMenuItem
                  onClick={() => onDuplicate()}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 size-4" />
                  Duplicate as draft
                </DropdownMenuItem>
              ) : null}
              {businessSlug && p.isPublished ? (
                <DropdownMenuItem asChild>
                  <Link href={`/store/${businessSlug}`} target="_blank" rel="noopener noreferrer">
                    View on store
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="mt-2 h-8 border-[var(--brand-primary)]/40 text-xs text-[var(--brand-primary)] hover:bg-[var(--brand-glow)]"
        >
          <Link href={`/products/${p.id}`}>
            <Star className="mr-1 size-3.5" />
            Improve with AI
          </Link>
        </Button>
      </div>
    </div>
  );
}
