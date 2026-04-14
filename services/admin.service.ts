import api from "@/lib/axios";
import type {
  AdminConversationRow,
  AdminProduct,
  AdminUpdateProductPayload,
  AdminUpdateUserPayload,
  AdminUserDetail,
  AdminUserListItem,
  AuditLogEntry,
} from "@/types/admin.types";
import type { UserRole } from "@/types/auth.types";
import type { Message } from "@/types/chat.types";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export const AdminService = {
  metrics: () => api.get("/admin/metrics").then((r) => r.data),

  listUsers: (params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) =>
    api.get<Paginated<AdminUserListItem>>("/admin/users", { params }).then((r) => r.data),

  getUser: (id: string) => api.get<AdminUserDetail>(`/admin/users/${id}`).then((r) => r.data),

  updateUser: (id: string, body: AdminUpdateUserPayload) =>
    api.patch<AdminUserListItem>(`/admin/users/${id}`, body).then((r) => r.data),

  listProducts: (params: {
    page?: number;
    limit?: number;
    userId?: string;
    search?: string;
  }) =>
    api.get<Paginated<AdminProduct>>("/admin/products", { params }).then((r) => r.data),

  getProduct: (id: string) => api.get<AdminProduct>(`/admin/products/${id}`).then((r) => r.data),

  updateProduct: (id: string, body: AdminUpdateProductPayload) =>
    api.patch<AdminProduct>(`/admin/products/${id}`, body).then((r) => r.data),

  deleteProduct: (id: string) => api.delete<{ deleted: boolean }>(`/admin/products/${id}`).then((r) => r.data),

  listConversations: (params: { page?: number; limit?: number }) =>
    api.get<Paginated<AdminConversationRow>>("/admin/conversations", { params }).then((r) => r.data),

  conversationMessages: (id: string, params: { page?: number; limit?: number }) =>
    api
      .get<{ items: Message[]; total: number; page: number; limit: number }>(
        `/admin/conversations/${id}/messages`,
        { params },
      )
      .then((r) => r.data),

  listAuditLogs: (params: {
    page?: number;
    limit?: number;
    actorUserId?: string;
    entityType?: string;
  }) => api.get<Paginated<AuditLogEntry>>("/admin/audit-logs", { params }).then((r) => r.data),
};
