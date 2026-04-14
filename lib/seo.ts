import type { Metadata } from "next";
import type { Product } from "@/types/product.types";
import type { PublicStorePayload } from "@/types/store.types";

export const SITE_NAME = "HerBizReach";

const DEFAULT_TITLE = `${SITE_NAME} — Your business, seen by more`;

/** Default meta description (OG, Twitter, JSON-LD). */
export const DEFAULT_SITE_DESCRIPTION =
  "AI-powered visibility for women-led SMEs across Africa. Share your catalog, sharpen product copy with AI, and sell on WhatsApp.";

/** Public path to default share image (logo). */
export const DEFAULT_OG_IMAGE_PATH = "/herbizreach-logo.png";

/**
 * Canonical site origin for metadata, OG URLs, and JSON-LD.
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. https://herbizreach.vercel.app).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}

/** Absolute URL for crawlers (WhatsApp, Facebook, X, LinkedIn). */
export function absolutizeUrl(pathOrUrl: string): string {
  const raw = pathOrUrl.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${getSiteUrl()}${path}`;
}

/** Prefer remote product/store image; otherwise default logo. */
export function ogImageUrl(imageUrl: string | null | undefined): string {
  if (imageUrl?.trim()) return absolutizeUrl(imageUrl.trim());
  return absolutizeUrl(DEFAULT_OG_IMAGE_PATH);
}

function storeDescription(data: PublicStorePayload): string {
  const s = data.storeSettings;
  const fromSettings = s?.description?.trim() || s?.tagline?.trim();
  if (fromSettings) return fromSettings.slice(0, 200);
  return `Shop ${data.business.businessName} on ${SITE_NAME}.`;
}

export function buildStorePageMetadata(slug: string, data: PublicStorePayload): Metadata {
  const url = absolutizeUrl(`/store/${slug}`);
  const title = data.business.businessName;
  const description = storeDescription(data);
  const banner = data.storeSettings?.bannerUrl?.trim();
  const image = ogImageUrl(banner || null);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_NG",
      images: [
        {
          url: image,
          alt: `${data.business.businessName} — storefront`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildProductPageMetadata(
  slug: string,
  productId: string,
  product: Product,
  storeName: string,
): Metadata {
  const url = absolutizeUrl(`/store/${slug}/products/${productId}`);
  const raw =
    product.descriptionAi?.trim() ||
    product.descriptionRaw?.trim() ||
    product.captionAi?.trim() ||
    "";
  const description = (raw || `Buy ${product.name} from ${storeName} on ${SITE_NAME}.`).slice(
    0,
    200,
  );
  const title = `${product.name} · ${storeName}`;
  const cover = product.imageUrls?.[0]?.trim() || product.imageUrl?.trim() || null;
  const image = ogImageUrl(cover);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_NG",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "HerBizReach",
    "women entrepreneurs",
    "SME",
    "Africa",
    "Nigeria",
    "WhatsApp commerce",
    "online storefront",
    "product catalog",
    "AI product descriptions",
    "small business",
  ],
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
