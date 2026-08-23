import { apiRequest } from "./api";

export type PaymentMethod = "cash" | "transfer" | "qris" | "card";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  _id: string;
  orderId: string;
  tableNumber: number;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaymentsResponse {
  data: Payment[];
  meta: PaginationMeta;
}

export async function getPayments(
  page = 1,
  limit = 10
): Promise<PaymentsResponse> {
  return apiRequest<PaymentsResponse>(`/payment?page=${page}&limit=${limit}`);
}

export async function getPaymentById(id: string): Promise<Payment> {
  return apiRequest<Payment>(`/payment/${id}`);
}
