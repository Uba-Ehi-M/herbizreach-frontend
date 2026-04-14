import api from "@/lib/axios";
import type { StoreSettings } from "@/types/store.types";

export type UpdateStoreSettingsPayload = {
  whatsAppPhone?: string;
  bannerUrl?: string;
  accentColor?: string;
  tagline?: string;
  description?: string;
  showChatWidget?: boolean;
};

export const StoreSettingsService = {
  get: () => api.get<StoreSettings>("/store-settings").then((r) => r.data),
  update: (body: UpdateStoreSettingsPayload) =>
    api.patch<StoreSettings>("/store-settings", body).then((r) => r.data),
};
