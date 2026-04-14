import { notFound } from "next/navigation";
import { StorePublicView } from "@/components/store/StorePublicView";
import { buildStorePageMetadata } from "@/lib/seo";
import { fetchPublicStore } from "@/lib/server-api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchPublicStore(slug);
  if (!data) return { title: "Store" };
  return buildStorePageMetadata(slug, data);
}

export default async function PublicStorePage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchPublicStore(slug);
  if (!data) notFound();
  return <StorePublicView initial={data} />;
}
