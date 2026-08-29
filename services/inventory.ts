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

export interface CreateInventoryPayload {
  name: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  quantity: number;
  minimumStock: number;
  costPrice: number;
  supplier?: string;
  notes?: string;
}

export interface UpdateInventoryPayload {
  name?: string;
  category?: InventoryCategory;
  unit?: InventoryUnit;
  quantity?: number;
  minimumStock?: number;
  costPrice?: number;
  supplier?: string;
  notes?: string;
}

export interface AdjustStockPayload {
  adjustment: number;
  reason?: string;
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

export async function createInventoryItem(payload: CreateInventoryPayload): Promise<{ insertedId: string }> {
  return apiRequest<{ insertedId: string }>("/inventory", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateInventoryItem(id: string, payload: UpdateInventoryPayload): Promise<InventoryItem> {
  return apiRequest<InventoryItem>(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adjustInventoryStock(id: string, payload: AdjustStockPayload): Promise<InventoryItem> {
  return apiRequest<InventoryItem>(`/inventory/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteInventoryItem(id: string): Promise<InventoryItem> {
  return apiRequest<InventoryItem>(`/inventory/${id}`, {
    method: "DELETE",
  });
}
