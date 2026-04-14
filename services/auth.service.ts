import api from "@/lib/axios";
import type { AuthResponse, AuthUser } from "@/types/auth.types";

export const AuthService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),

  registerOwner: (body: {
    fullName: string;
    email: string;
    password: string;
    businessName: string;
    phone?: string;
  }) => api.post<AuthResponse>("/auth/register", body).then((r) => r.data),

  me: () => api.get<AuthUser>("/auth/me").then((r) => r.data),
};
