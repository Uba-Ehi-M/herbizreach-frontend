import type { PublicStorePayload } from "@/types/store.types";
import type { Product } from "@/types/product.types";
import { getDemoProduct, getDemoStorePayload, isDemoStoreSlug } from "@/lib/demo-store";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
}

export async function fetchPublicStore(slug: string): Promise<PublicStorePayload | null> {
  if (isDemoStoreSlug(slug)) return getDemoStorePayload();
  try {
    const res = await fetch(`${apiBase()}/store/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicStorePayload;
  } catch {
    return null;
  }
}

/** Matches `GET /store/:slug/products/:productId` — body is `{ business, product }`, not a bare product. */
type PublicProductApiPayload = {
  business: { id: string; businessName: string; businessSlug: string };
  product: Product;
};

export async function fetchPublicProduct(
  slug: string,
  productId: string,
): Promise<Product | null> {
  if (isDemoStoreSlug(slug)) return getDemoProduct(productId);
  try {
    const res = await fetch(`${apiBase()}/store/${slug}/products/${productId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PublicProductApiPayload;
    if (!data?.product?.id || !data.product.name) return null;
    return data.product;
  } catch {
    return null;
  }
}
