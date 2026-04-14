import { notFound } from "next/navigation";
import { StoreGuestChatClient } from "@/components/store/StoreGuestChatClient";
import { SITE_NAME, buildStorePageMetadata } from "@/lib/seo";
import { fetchPublicProduct, fetchPublicStore } from "@/lib/server-api";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ product?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchPublicStore(slug);
  if (!data) return { title: "Chat" };
  const title = `Message ${data.business.businessName}`;
  const description = `Chat with ${data.business.businessName} on ${SITE_NAME}.`;
  const base = buildStorePageMetadata(slug, data);
  return {
    ...base,
    title,
    description,
    openGraph: { ...base.openGraph, title, description },
    twitter: { ...base.twitter, title, description },
  };
}

export default async function StoreGuestChatPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { product: productId } = await searchParams;
  const store = await fetchPublicStore(slug);
  if (!store) notFound();

  let product: { id: string; name: string } | null = null;
  if (productId?.trim()) {
    const p = await fetchPublicProduct(slug, productId.trim());
    if (p) product = { id: p.id, name: p.name };
  }

  return (
    <StoreGuestChatClient
      slug={slug}
      storeName={store.business.businessName}
      accent={store.storeSettings?.accentColor ?? "#7c3aed"}
      chatEnabled={store.storeSettings?.showChatWidget !== false}
      product={product}
    />
  );
}
