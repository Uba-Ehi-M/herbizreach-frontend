import type { Product } from "@/types/product.types";
import type { PublicStorePayload } from "@/types/store.types";

export const DEMO_STORE_SLUG = "demo";

const DEMO_NOW = "2026-01-15T12:00:00.000Z";

function demoProducts(): Product[] {
  return [
    {
      id: "demo-ankara-wrap",
      userId: "demo-user",
      name: "Ankara wrap dress — emerald",
      price: "28500.00",
      sku: null,
      stockQuantity: 8,
      lowStockThreshold: 2,
      featured: true,
      descriptionRaw: "Midi wrap dress in premium ankara. Lined bodice, side tie, pockets.",
      descriptionAi:
        "Turn heads in this emerald ankara wrap dress: a flattering midi length, soft lining, and practical pockets — perfect for office Fridays, weddings, and Sunday brunch.",
      captionAi: "Emerald wrap · true to size · ships Lagos-wide",
      imageUrls: ["/herbizreach-logo.png"],
      imageUrl: "/herbizreach-logo.png",
      isPublished: true,
      createdAt: DEMO_NOW,
      categories: [
        {
          id: "demo-cat-fashion",
          slug: "fashion",
          name: "Fashion",
        },
      ],
    },
    {
      id: "demo-shea-glow",
      userId: "demo-user",
      name: "Shea glow body butter (200g)",
      price: "7500.00",
      sku: "SGB-200",
      stockQuantity: 24,
      lowStockThreshold: 5,
      featured: false,
      descriptionRaw: "Whipped shea with vitamin E. Unscented base; light floral note.",
      descriptionAi:
        "Rich, whipped shea butter blended with vitamin E for long-lasting moisture — absorbs cleanly without a greasy film. Ideal after showers and before bed.",
      captionAi: "200g jar · handmade · patch-test friendly",
      imageUrls: ["/herbizreach-logo.png"],
      imageUrl: "/herbizreach-logo.png",
      isPublished: true,
      createdAt: DEMO_NOW,
      categories: [
        {
          id: "demo-cat-skincare",
          slug: "skincare",
          name: "Skincare",
        },
      ],
    },
    {
      id: "demo-beaded-clutch",
      userId: "demo-user",
      name: "Hand-beaded evening clutch",
      price: "19200.00",
      sku: null,
      stockQuantity: 3,
      lowStockThreshold: 1,
      featured: true,
      descriptionRaw: "Glass beads on satin frame. Detachable chain. Fits phone + keys.",
      descriptionAi:
        "A compact evening clutch covered in hand-set glass beads — subtle shimmer under lights, with a detachable chain so you can wear it crossbody or carry it as a clutch.",
      captionAi: "Limited stock · gift-ready box",
      imageUrls: ["/herbizreach-logo.png"],
      imageUrl: "/herbizreach-logo.png",
      isPublished: true,
      createdAt: DEMO_NOW,
      categories: [
        {
          id: "demo-cat-accessories",
          slug: "accessories",
          name: "Accessories",
        },
      ],
    },
  ];
}

export function isDemoStoreSlug(slug: string): boolean {
  return slug === DEMO_STORE_SLUG;
}

/** Static sample storefront for `/store/demo` — matches real API shape. */
export function getDemoStorePayload(): PublicStorePayload {
  return {
    business: {
      id: "demo-business",
      businessName: "Amaka Studio (sample)",
      businessSlug: DEMO_STORE_SLUG,
      fullName: "Demo Merchant",
      phone: "+2348000000000",
      createdAt: DEMO_NOW,
      avatarUrl: "/herbizreach-logo.png",
    },
    storeSettings: {
      id: "demo-settings",
      userId: "demo-user",
      whatsAppPhone: "+2348000000000",
      bannerUrl: null,
      accentColor: "#7c3aed",
      tagline: "Bold prints, clean skincare, and statement accessories — shipped with love.",
      description:
        "This is a sample HerBizReach storefront so you can explore the layout, product cards, and WhatsApp actions before you publish your own store.",
      showChatWidget: true,
    },
    products: demoProducts(),
  };
}

export function getDemoProduct(productId: string): Product | null {
  return getDemoStorePayload().products.find((p) => p.id === productId) ?? null;
}
