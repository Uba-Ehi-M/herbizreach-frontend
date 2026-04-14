import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";

export const ANALYTICS_KEY = ["analytics", "overview"] as const;

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ANALYTICS_KEY,
    queryFn: AnalyticsService.overview,
  });
}
