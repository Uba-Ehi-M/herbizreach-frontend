import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const origin = new URL(request.url).origin;

  const manifest = {
    id: `herbizreach-store-${slug}`,
    name: `HerBizReach — ${slug}`,
    short_name: slug.length > 14 ? `${slug.slice(0, 12)}…` : slug,
    description: "Shop this store on HerBizReach",
    start_url: `/store/${slug}`,
    scope: `/store/${slug}/`,
    display: "standalone" as const,
    orientation: "portrait-primary" as const,
    background_color: "#faf5ff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: `${origin}/herbizreach-logo.png`,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
