import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  StoreSettingsService,
  type UpdateStoreSettingsPayload,
} from "@/services/store-settings.service";

export const STORE_SETTINGS_KEY = ["store-settings"] as const;

export function useStoreSettings() {
  return useQuery({
    queryKey: STORE_SETTINGS_KEY,
    queryFn: StoreSettingsService.get,
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateStoreSettingsPayload) => StoreSettingsService.update(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: STORE_SETTINGS_KEY });
      toast.success("Settings saved.");
    },
    onError: () => toast.error("Could not save settings."),
  });
}
