export interface AnalyticsTotals {
  pageViews: number;
  shares: number;
}

export interface AnalyticsProductRow {
  productId: string;
  name: string;
  isPublished: boolean;
  pageViews: number;
  shares: number;
}

export interface AnalyticsOverview {
  totals: AnalyticsTotals;
  products: AnalyticsProductRow[];
  viewsLast7Days: { date: string; count: number }[];
}
