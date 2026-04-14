import api from "@/lib/axios";
import type { AnalyticsOverview } from "@/types/analytics.types";

export const AnalyticsService = {
  overview: () =>
    api.get<AnalyticsOverview>("/analytics/overview").then((r) => r.data),
};
