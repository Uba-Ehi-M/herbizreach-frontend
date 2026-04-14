import type { Product } from "./product.types";

export interface PublicBusiness {
  id: string;
  businessName: string;
  businessSlug: string;
  fullName: string;
  phone: string | null;
  createdAt: string;
  avatarUrl: string | null;
}

export interface StoreSettings {
  id: string;
  userId: string;
  whatsAppPhone: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  tagline: string | null;
  description: string | null;
  showChatWidget: boolean;
}

export interface PublicStorePayload {
  business: PublicBusiness;
  storeSettings: StoreSettings | null;
  products: Product[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
}
