import { apiRequest } from "./api";

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface OrderItem {
  menuId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  tableNumber: number;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem {
  menuId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  tableNumber: number;
  customerName?: string;
  items: CreateOrderItem[];
  notes?: string;
}

export interface UpdateOrderPayload {
  tableNumber?: number;
  customerName?: string;
  items?: CreateOrderItem[];
  status?: OrderStatus;
  notes?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OrdersResponse {
  data: Order[];
  meta: PaginationMeta;
}

export async function getOrders(
  page = 1,
  limit = 10
): Promise<OrdersResponse> {
  return apiRequest<OrdersResponse>(
    `/orders?page=${page}&limit=${limit}`
  );
}

export async function getOrderById(
  id: string
): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}`);
}

export async function getOrdersByStatus(
  status: OrderStatus,
  page = 1,
  limit = 10
): Promise<OrdersResponse> {
  return apiRequest<OrdersResponse>(
    `/orders/status/${status}?page=${page}&limit=${limit}`
  );
}

export async function createOrder(
  payload: CreateOrderPayload
) {
  return apiRequest<{ insertedId: string }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateOrder(
  id: string,
  payload: UpdateOrderPayload
) {
  return apiRequest<Order>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteOrder(
  id: string
) {
  return apiRequest<Order>(`/orders/${id}`, {
    method: "DELETE",
  });
}

export type PaymentMethod = "cash" | "transfer" | "qris" | "card";

export interface CreatePaymentPayload {
  orderId: string;
  paidAmount: number;
  method: PaymentMethod;
  notes?: string;
}

export interface PaymentResponse {
  insertedId: string;
}

export async function createPayment(
  payload: CreatePaymentPayload
): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>("/payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}