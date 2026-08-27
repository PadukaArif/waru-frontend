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

export async function register(data: RegisterData) {
    const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);

    return response;
}

export async function login(data: LoginData) {
    const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    localStorage.setItem("token", response.token);

    return response;
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
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
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
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
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const payload = getJwtPayload();
  return payload?.role || null;
}