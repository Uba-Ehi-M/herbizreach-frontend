"use client";

import { Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { resetSocket } from "@/lib/socket";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogStoreShare, useLogStoreView } from "@/hooks/useStore";
import type { PublicStorePayload } from "@/types/store.types";
import { StoreProductCard } from "./StoreProductCard";
import { WhatsAppShareButton } from "./WhatsAppShareButton";

export function StorePublicView(props: { initial: PublicStorePayload }) {
  const { initial } = props;
  const slug = initial.business.businessSlug;
  const accent = initial.storeSettings?.accentColor ?? "#7c3aed";
  const logView = useLogStoreView(slug);
  const logShare = useLogStoreShare(slug);

  useEffect(() => {
    logView.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- log view once per slug
  }, [slug]);

  useEffect(() => {
    return () => {
      resetSocket();
    };
  }, []);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/store/${slug}`
      : `/store/${slug}`;

  async function shareStore() {
    const payload = {
      title: initial.business.businessName,
      text: `Shop ${initial.business.businessName} on HerBizReach`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        logShare.mutate({ channel: "native_share" });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Store link copied");
        logShare.mutate({ channel: "clipboard" });
      }
    } catch {
      toast.error("Could not share");
    }
  }

  const waMsg = `Hi! I found ${initial.business.businessName} on HerBizReach.`;
  const waPhone =
    initial.storeSettings?.whatsAppPhone ?? initial.business.phone ?? null;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header
        className="relative overflow-hidden border-b border-[var(--border-default)]"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, var(--bg-subtle) 50%, var(--bg-base) 100%)`,
        }}
      >
        {initial.storeSettings?.bannerUrl ? (
          <div className="relative h-40 w-full md:h-52">
            <Image
              src={initial.storeSettings.bannerUrl}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
          </div>
        ) : null}
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                {initial.business.businessName}
              </h1>
              {initial.storeSettings?.tagline ? (
                <p className="mt-2 max-w-xl text-[var(--text-secondary)]">
                  {initial.storeSettings.tagline}
                </p>
              ) : null}
              {initial.storeSettings?.description ? (
                <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                  {initial.storeSettings.description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <WhatsAppShareButton phone={waPhone} message={waMsg} />
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => void shareStore()}
              >
                <Share2 className="mr-2 size-4" />
                Share store
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)]">
          Products
        </h2>
        {initial.products.length === 0 ? (
          <p className="text-[var(--text-muted)]">New products coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {initial.products.map((p) => (
              <StoreProductCard key={p.id} product={p} slug={slug} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
