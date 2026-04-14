import type { Metadata, Viewport } from "next";
import { AddToHomeBanner } from "@/components/store/AddToHomeBanner";
import { StorePwaRegister } from "@/components/store/StorePwaRegister";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    manifest: `/store/${slug}/manifest`,
    appleWebApp: {
      capable: true,
      title: "HerBizReach store",
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default async function PublicStoreLayout({ children, params }: Props) {
  const { slug } = await params;
  return (
    <>
      <StorePwaRegister />
      <AddToHomeBanner storeSlug={slug} />
      {children}
    </>
  );
}
