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
    localStorage.removeItem("token");
}