import {
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  absolutizeUrl,
  getSiteUrl,
} from "@/lib/seo";

/** Organization + WebSite structured data for rich results. */
export function WebSiteJsonLd() {
  const origin = getSiteUrl();
  const logoUrl = absolutizeUrl(DEFAULT_OG_IMAGE_PATH);
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        description: DEFAULT_SITE_DESCRIPTION,
        publisher: { "@id": `${origin}/#organization` },
        inLanguage: "en-NG",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
