"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.types";

export function ProductCard(props: {
  product: Product;
  viewCount?: number;
  index?: number;
  onDelete?: () => void;
  onDuplicate?: () => void;
}) {
  const { product, viewCount = 0, index = 0, onDelete, onDuplicate } = props;
  const imageSrc =
    product.imageUrls?.[0]?.trim() || product.imageUrl?.trim() || "";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-[var(--bg-muted)] md:aspect-[3/2]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 280px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
            No photo
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={product.isPublished ? "success" : "secondary"}>
            {product.isPublished ? "Live" : "Draft"}
          </Badge>
        </div>
      </div>
      <div className="space-y-1.5 p-3 sm:space-y-2 sm:p-4">
        <h3 className="truncate text-sm font-[family-name:var(--font-display)] font-semibold leading-tight text-[var(--text-primary)] sm:text-base">
          {product.name}
        </h3>
        <p className="text-xs font-medium text-[var(--brand-primary)] sm:text-sm">
          {formatCurrency(product.price)}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] sm:text-xs">{viewCount} views</p>
        <div className="grid grid-cols-2 gap-1.5 pt-1 sm:flex sm:flex-wrap sm:gap-2">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="min-h-9 min-w-0 flex-1 px-2 text-xs sm:min-h-10 sm:min-w-[5.5rem] sm:px-3 sm:text-sm"
          >
            <Link href={`/products/${product.id}`} className="justify-center">
              <Pencil className="mr-0.5 size-3.5 shrink-0 sm:mr-1 sm:size-4" />
              Edit
            </Link>
          </Button>
          {onDuplicate ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="min-h-9 min-w-0 flex-1 px-2 text-xs sm:min-h-10 sm:min-w-[5.5rem] sm:px-3 sm:text-sm"
              onClick={onDuplicate}
            >
              <Copy className="mr-0.5 size-3.5 shrink-0 sm:mr-1 sm:size-4" />
              Duplicate
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="col-span-2 min-h-9 w-full justify-center px-2.5 sm:col-span-1 sm:w-auto sm:min-h-10 sm:shrink-0 sm:px-3"
              onClick={onDelete}
              aria-label="Delete product"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
