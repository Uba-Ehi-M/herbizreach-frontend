"use client";

import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppendProductImages, useUpdateProduct } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 8;

export function ProductGalleryEditor(props: { productId: string; imageUrls: string[] }) {
  const { productId, imageUrls } = props;
  const [urls, setUrls] = useState<string[]>(imageUrls);
  const fileRef = useRef<HTMLInputElement>(null);
  const updateProduct = useUpdateProduct(productId);
  const appendImages = useAppendProductImages(productId);

  useEffect(() => {
    setUrls([...imageUrls]);
  }, [productId, imageUrls.join("\n")]);

  function persistOrder(next: string[]) {
    const prev = urls;
    setUrls(next);
    updateProduct.mutate(
      { imageUrls: next },
      {
        onError: () => setUrls(prev),
      },
    );
  }

  function removeAt(i: number) {
    const next = urls.filter((_, j) => j !== i);
    if (next.length === 0) return;
    persistOrder(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= urls.length) return;
    const next = [...urls];
    [next[i], next[j]] = [next[j], next[i]];
    persistOrder(next);
  }

  function onPickFiles(e: ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;
    const picked = Array.from(list).slice(0, MAX_IMAGES - urls.length);
    if (!picked.length) {
      e.target.value = "";
      return;
    }
    const fd = new FormData();
    picked.forEach((f) => fd.append("images", f));
    appendImages.mutate(fd, {
      onSuccess: (data) => setUrls([...data.imageUrls]),
    });
    e.target.value = "";
  }

  const busy = updateProduct.isPending || appendImages.isPending;
  const room = MAX_IMAGES - urls.length;

  return (
    <Card className="border-[var(--border-default)]">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Photos</CardTitle>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPickFiles}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-h-9"
            disabled={busy || room <= 0}
            onClick={() => fileRef.current?.click()}
          >
            {appendImages.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-1 size-4" />
                Add ({room} left)
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {busy && !appendImages.isPending ? (
          <p className="mb-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Loader2 className="size-3.5 animate-spin" />
            Saving order…
          </p>
        ) : null}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, i) => (
            <li
              key={url}
              className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-muted)] ring-1 ring-[var(--border-default)]"
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:640px) 45vw, 160px"
                unoptimized={url.startsWith("http://localhost")}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 pt-6">
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className={cn("size-8 rounded-md bg-white/90", i === 0 && "opacity-40")}
                    disabled={busy || i === 0}
                    aria-label="Move earlier"
                    onClick={() => move(i, -1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className={cn("size-8 rounded-md bg-white/90", i === urls.length - 1 && "opacity-40")}
                    disabled={busy || i === urls.length - 1}
                    aria-label="Move later"
                    onClick={() => move(i, 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-8 rounded-md"
                  disabled={busy || urls.length <= 1}
                  aria-label="Remove photo"
                  onClick={() => removeAt(i)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        {urls.length <= 1 ? (
          <p className="mt-3 text-xs text-[var(--text-muted)]">Add more angles so buyers trust what they&apos;re getting.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
