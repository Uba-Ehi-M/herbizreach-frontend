import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/products",
        "/analytics",
        "/chat",
        "/settings",
        "/leads",
        "/admin",
        "/login",
        "/register",
        "/forgot-password",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
