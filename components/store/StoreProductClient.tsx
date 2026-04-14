"use client";

import { MessageCircle, Share2, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogStoreShare, useLogStoreView } from "@/hooks/useStore";
import { resetSocket } from "@/lib/socket";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.types";
import type { PublicStorePayload } from "@/types/store.types";
import { WhatsAppShareButton } from "./WhatsAppShareButton";

export function StoreProductClient(props: {
  slug: string;
  product: Product;
  store: PublicStorePayload;
}) {
  const { slug, product, store } = props;
  const accent = store.storeSettings?.accentColor ?? "#7c3aed";
  const logView = useLogStoreView(slug);
  const logShare = useLogStoreShare(slug);

  useEffect(() => {
    logView.mutate({ productId: product.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, product.id]);

  useEffect(() => {
    return () => {
      resetSocket();
    };
  }, []);

  const desc =
    product.descriptionAi?.trim() || product.descriptionRaw?.trim() || "";
  const waPhone =
    store.storeSettings?.whatsAppPhone ?? store.business.phone ?? null;
  const waMsg = `Hi! I'm interested in ${product.name} from ${store.business.businessName}.`;
  const gallery =
    product.imageUrls?.length ? product.imageUrls : product.imageUrl?.trim() ? [product.imageUrl.trim()] : [];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [product.id]);

  const imageSrc = gallery[Math.min(activeIdx, Math.max(0, gallery.length - 1))] ?? "";
  const messageSellerHref = `/store/${slug}/chat?product=${encodeURIComponent(product.id)}`;

  async function shareProduct() {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `/store/${slug}/products/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ${store.business.businessName}`,
          url,
        });
        logShare.mutate({ productId: product.id, channel: "native_share" });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied");
        logShare.mutate({ productId: product.id, channel: "clipboard" });
      }
    } catch {
      toast.error("Could not share");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header
        className="border-b border-[var(--border-default)]"
        style={{
          background: `linear-gradient(135deg, ${accent}18 0%, var(--bg-subtle) 45%, var(--bg-base) 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
          <nav
            className="mb-4 flex flex-wrap items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href={`/store/${slug}`}
              className="inline-flex max-w-[min(100%,16rem)] items-center gap-1.5 font-medium text-[var(--brand-primary)] hover:underline"
            >
              <Store className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{store.business.businessName}</span>
            </Link>
            <span className="text-[var(--text-muted)]" aria-hidden>
              /
            </span>
            <span className="min-w-0 truncate text-[var(--text-muted)]">{product.name}</span>
          </nav>
          {store.storeSettings?.tagline ? (
            <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
              {store.storeSettings.tagline}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:pb-24 md:pt-10">
        <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="mx-auto w-full max-w-lg space-y-3 lg:mx-0 lg:max-w-none lg:sticky lg:top-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--bg-muted)] shadow-[var(--shadow-md)] ring-1 ring-[var(--border-default)] lg:aspect-square">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={imageSrc.startsWith("http://localhost")}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
                  <span className="text-4xl opacity-40" aria-hidden>
                    📷
                  </span>
                  <p className="text-sm text-[var(--text-muted)]">No photo for this product yet</p>
                </div>
              )}
            </div>
            {gallery.length > 1 ? (
              <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product photos">
                {gallery.map((url, i) => (
                  <li key={`${url}-${i}`} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`relative size-16 overflow-hidden rounded-lg ring-2 transition sm:size-20 ${
                        i === activeIdx ? "ring-[var(--brand-primary)]" : "ring-transparent opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === activeIdx}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={url.startsWith("http://localhost")}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col">
            {product.categories.length > 0 ? (
              <ul className="mb-3 flex flex-wrap gap-2">
                {product.categories.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-[var(--border-default)]"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            ) : null}

            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <p
              className="mt-4 text-2xl font-bold tabular-nums md:text-3xl"
              style={{ color: accent }}
            >
              {formatCurrency(product.price)}
            </p>

            <div className="mt-6 border-t border-[var(--border-default)] pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                About this product
              </h2>
              {desc ? (
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-[var(--text-secondary)]">
                  {desc}
                </p>
              ) : (
                <p className="mt-3 text-sm italic text-[var(--text-muted)]">
                  The seller hasn&apos;t added a detailed description yet. Message them on WhatsApp to
                  learn more.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppShareButton
                phone={waPhone}
                message={waMsg}
                className="min-h-12 flex-1 sm:min-w-[200px] sm:flex-none"
              />
              <Button
                asChild
                variant="secondary"
                className="min-h-12 flex-1 border-[var(--brand-primary)]/35 bg-[var(--brand-glow)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/15 sm:min-w-[180px] sm:flex-none"
              >
                <Link href={messageSellerHref}>
                  <MessageCircle className="mr-2 size-4" />
                  Message seller
                </Link>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="min-h-12 flex-1 sm:min-w-[160px] sm:flex-none"
                onClick={() => void shareProduct()}
              >
                <Share2 className="mr-2 size-4" />
                Share product
              </Button>
              <Button variant="ghost" asChild className="min-h-12 border border-[var(--border-default)] sm:w-auto">
                <Link href={`/store/${slug}`}>More from this store</Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
