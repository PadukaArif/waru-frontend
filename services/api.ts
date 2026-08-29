const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum diset");
  }

  const token = getStoredToken();

  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")
        ) {
          window.location.href = "/login";
        }
      }
      throw new ApiError(
        data.message || "Akses ditolak. Token tidak valid atau sesi telah berakhir.",
        401
      );
    }

    if (response.status === 403) {
      throw new ApiError(
        data.message || "Akses ditolak. Anda tidak memiliki hak akses untuk resource ini.",
        403
      );
    }

    throw new ApiError(data.message || "Terjadi kesalahan pada server", response.status);
  }

  return data;
}