import type { Metadata } from "next";
import "./globals.css";
import { displayFont, bodyFont } from "./fonts";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { Providers } from "@/components/providers";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen antialiased">
        <WebSiteJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
