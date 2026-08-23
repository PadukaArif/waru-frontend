import { apiRequest } from "./api";

export type MenuCategory = "Heavy Food" | "Light Food";

export interface Menu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  isAvailable: boolean;
  isRecommended: boolean;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface MenuListResponse {
  data: Menu[];
  meta: MenuMeta;
}

export async function getMenus(
  page = 1,
  limit = 10
): Promise<MenuListResponse> {
  return apiRequest<MenuListResponse>(
    `/menu?page=${page}&limit=${limit}`
  );
}

export async function getMenuById(id: string): Promise<Menu> {
  return apiRequest<Menu>(`/menu/${id}`);
}

export interface CreateMenuInput {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  isAvailable: boolean;
  isRecommended: boolean;
  imageUrl: string;
}

export type UpdateMenuInput = Partial<CreateMenuInput>;

export async function createMenu(
  menu: CreateMenuInput
): Promise<Menu> {
  return apiRequest<Menu>("/menu", {
    method: "POST",
    body: JSON.stringify(menu),
  });
}

export async function updateMenu(
  id: string,
  menu: UpdateMenuInput
): Promise<Menu> {
  return apiRequest<Menu>(`/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(menu),
  });
}

export async function deleteMenu(id: string) {
  return apiRequest(`/menu/${id}`, {
    method: "DELETE",
  });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum diset");
  }

  const formData = new FormData();
  formData.append("file", file);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengunggah gambar");
  }

  return data;
}