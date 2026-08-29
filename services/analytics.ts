import { apiRequest } from "./api";

export type AnalyticsPeriod = "today" | "week" | "month" | "year";

export interface SalesOverview {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface TopMenuItem {
  name: string;
  totalSold: number;
  totalRevenue: number;
}

export interface PaymentMethodSummary {
  method: string;
  count: number;
  total: number;
}

export interface InventorySummary {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  safeStockCount: number;
  totalInventoryValue: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}

export interface AnalyticsDashboardData {
  period: AnalyticsPeriod;
  dateRange: { from: string; to: string };
  sales: SalesOverview;
  dailySales: DailySales[];
  topMenuItems: TopMenuItem[];
  paymentMethods: PaymentMethodSummary[];
  inventory: InventorySummary;
  reviews: ReviewSummary;
}

export async function getAnalyticsDashboard(
  period: AnalyticsPeriod = "month"
): Promise<AnalyticsDashboardData> {
  return apiRequest<AnalyticsDashboardData>(`/analytics/dashboard?period=${period}`);
}
