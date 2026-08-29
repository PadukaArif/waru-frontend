import { apiRequest } from "./api";

export type KitchenStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface KitchenMenuItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface KitchenItem {
  _id: string;
  orderId: string;
  tableNumber: number;
  menuItems: KitchenMenuItem[];
  status: KitchenStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KitchenListResponse {
  data: KitchenItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getKitchenOrders(
  page = 1,
  limit = 50
): Promise<KitchenListResponse> {
  return apiRequest<KitchenListResponse>(`/kitchen?page=${page}&limit=${limit}`);
}

export async function getKitchenOrdersByStatus(
  status: KitchenStatus,
  page = 1,
  limit = 50
): Promise<KitchenListResponse> {
  return apiRequest<KitchenListResponse>(
    `/kitchen/status/${status}?page=${page}&limit=${limit}`
  );
}

export async function getKitchenOrderById(id: string): Promise<KitchenItem> {
  return apiRequest<KitchenItem>(`/kitchen/${id}`);
}

export async function updateKitchenOrderStatus(
  id: string,
  status: KitchenStatus
): Promise<KitchenItem> {
  return apiRequest<KitchenItem>(`/kitchen/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
