export type UserRole = "OWNER" | "CUSTOMER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  businessName: string | null;
  businessSlug: string | null;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  disabledAt: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
