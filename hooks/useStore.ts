import { useMutation } from "@tanstack/react-query";
import { StoreService } from "@/services/store.service";

export function useLogStoreView(slug: string) {
  return useMutation({
    mutationFn: (body: { productId?: string; referrer?: string }) =>
      StoreService.logView(slug, body),
  });
}

export function useLogStoreShare(slug: string) {
  return useMutation({
    mutationFn: (body: { productId?: string; channel?: string }) =>
      StoreService.logShare(slug, body),
  });
}

export function useCreateStoreLead(slug: string) {
  return useMutation({
    mutationFn: (body: {
      name: string;
      phone: string;
      message?: string;
      productId?: string;
    }) => StoreService.createLead(slug, body),
  });
}
