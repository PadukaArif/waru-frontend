import { apiRequest } from "./api";

export type InventoryCategory = "food" | "beverage" | "packaging" | "equipment" | "other";
export type InventoryUnit = "pcs" | "kg" | "liter" | "gram" | "ml" | "box" | "pack";

export interface InventoryItem {
  _id: string;
  name: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  quantity: number;
  minimumStock: number;
  costPrice: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryListResponse {
  data: InventoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getInventoryItems(page = 1, limit = 100): Promise<InventoryListResponse> {
  return apiRequest<InventoryListResponse>(`/inventory?page=${page}&limit=${limit}`);
}

export async function getLowStockInventoryItems(page = 1, limit = 100): Promise<InventoryListResponse> {
  return apiRequest<InventoryListResponse>(`/inventory/low-stock?page=${page}&limit=${limit}`);
}

export async function getInventoryById(id: string): Promise<InventoryItem> {
  return apiRequest<InventoryItem>(`/inventory/${id}`);
}
