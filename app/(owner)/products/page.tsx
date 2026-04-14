"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/ProductCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useDeleteProduct, useDuplicateProduct, useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

type Filter = "all" | "published" | "draft";

export default function ProductsPage() {
  const { data, isLoading } = useProducts();
  const { data: analytics } = useAnalyticsOverview();
  const deleteProduct = useDeleteProduct();
  const duplicateProduct = useDuplicateProduct();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const views = useMemo(
    () => new Map(analytics?.products.map((p) => [p.productId, p.pageViews]) ?? []),
    [analytics?.products],
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      const matchQ = p.name.toLowerCase().includes(q.trim().toLowerCase());
      const matchF =
        filter === "all" ||
        (filter === "published" && p.isPublished) ||
        (filter === "draft" && !p.isPublished);
      return matchQ && matchF;
    });
  }, [data, q, filter]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <PageHeader title="Products" description="Manage your catalog" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name"
            className="min-h-11 pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["published", "Published"],
              ["draft", "Unpublished"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={filter === key ? "default" : "secondary"}
              className="min-h-10"
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {!data?.length ? (
        <EmptyState
          title="No products yet"
          description="Add your first product with a photo and description."
          actionLabel="Add product"
          actionHref="/products/new"
        />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-5">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              viewCount={views.get(p.id) ?? 0}
              index={i}
              onDelete={() => setDeleteId(p.id)}
              onDuplicate={() => duplicateProduct.mutate(p.id)}
            />
          ))}
        </div>
      )}

      <Link
        href="/products/new"
        className={cn(
          "fixed bottom-24 right-4 z-30 flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-sm font-semibold text-[var(--text-inverse)] shadow-[var(--shadow-brand)] md:bottom-8",
        )}
      >
        <Plus className="size-5" />
        Add product
      </Link>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete product?"
        description="This cannot be undone. Customers will no longer see this listing."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteId) {
            deleteProduct.mutate(deleteId);
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
