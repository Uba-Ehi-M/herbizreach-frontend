import { notFound } from "next/navigation";
import { StoreProductClient } from "@/components/store/StoreProductClient";
import { buildProductPageMetadata } from "@/lib/seo";
import { fetchPublicProduct, fetchPublicStore } from "@/lib/server-api";

type Props = { params: Promise<{ slug: string; productId: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, productId } = await params;
  const [product, store] = await Promise.all([
    fetchPublicProduct(slug, productId),
    fetchPublicStore(slug),
  ]);
  if (!product || !store) return { title: "Product" };
  return buildProductPageMetadata(slug, productId, product, store.business.businessName);
}

export default async function StoreProductPage({ params }: Props) {
  const { slug, productId } = await params;
  const store = await fetchPublicStore(slug);
  const product = await fetchPublicProduct(slug, productId);
  if (!store || !product) notFound();
  return <StoreProductClient slug={slug} product={product} store={store} />;
}
