import api from "@/lib/axios";
import type { Product } from "@/types/product.types";
import type { PublicStorePayload } from "@/types/store.types";

export const StoreService = {
  getPublicStore: (slug: string) =>
    api.get<PublicStorePayload>(`/store/${slug}`).then((r) => r.data),

  getPublicProduct: (slug: string, productId: string) =>
    api.get<Product>(`/store/${slug}/products/${productId}`).then((r) => r.data),

  logView: (slug: string, body: { productId?: string; referrer?: string }) =>
    api.post(`/store/${slug}/view`, body).then((r) => r.data),

  logShare: (slug: string, body: { productId?: string; channel?: string }) =>
    api.post(`/store/${slug}/share`, body).then((r) => r.data),

  createLead: (
    slug: string,
    body: { name: string; phone: string; message?: string; productId?: string },
  ) => api.post(`/store/${slug}/leads`, body).then((r) => r.data),
};
