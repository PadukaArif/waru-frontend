import { apiRequest } from "./api";

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

let cachedToken: string | null = null;
let cachedPayload: JwtPayload | null = null;

export function clearAuthCache(): void {
  cachedToken = null;
  cachedPayload = null;
}

export async function register(data: RegisterData) {
    const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);
    clearAuthCache();

    return response;
}

export async function login(data: LoginData) {
    const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);
    clearAuthCache();

    return response;
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
    clearAuthCache();
}

export interface JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function getJwtPayload(): JwtPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) {
    clearAuthCache();
    return null;
  }

  // Fast path: return cached payload if token string has not changed
  if (token === cachedToken && cachedPayload) {
    if (cachedPayload.exp && cachedPayload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      clearAuthCache();
      return null;
    }
    return cachedPayload;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      clearAuthCache();
      return null;
    }
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded: JwtPayload = JSON.parse(jsonPayload);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      clearAuthCache();
      return null;
    }

    // Cache the parsed token string and payload
    cachedToken = token;
    cachedPayload = decoded;

    return decoded;
  } catch {
    clearAuthCache();
    return null;
  }
}

export function getUserRole(): string | null {
  const payload = getJwtPayload();
  return payload?.role || null;
}