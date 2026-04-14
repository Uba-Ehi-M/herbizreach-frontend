import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AdminService, type Paginated } from "@/services/admin.service";
import type {
  AdminProduct,
  AdminUpdateProductPayload,
  AdminUpdateUserPayload,
  AdminUserListItem,
  AuditLogEntry,
} from "@/types/admin.types";
import type { UserRole } from "@/types/auth.types";
import type { AdminConversationRow } from "@/types/admin.types";

export const ADMIN_METRICS_KEY = ["admin", "metrics"] as const;

export const adminUsersKey = (params: {
  page: number;
  limit: number;
  role?: UserRole;
  search?: string;
}) => ["admin", "users", params] as const;

export const adminUserKey = (id: string) => ["admin", "users", id] as const;

export const adminProductsKey = (params: {
  page: number;
  limit: number;
  userId?: string;
  search?: string;
}) => ["admin", "products", params] as const;

export const adminProductKey = (id: string) => ["admin", "products", id] as const;

export const adminConversationsKey = (params: { page: number; limit: number }) =>
  ["admin", "conversations", params] as const;

export const adminMessagesKey = (conversationId: string, params: { page: number; limit: number }) =>
  ["admin", "conversations", conversationId, "messages", params] as const;

export const adminAuditKey = (params: {
  page: number;
  limit: number;
  actorUserId?: string;
  entityType?: string;
}) => ["admin", "audit", params] as const;

export function useAdminMetrics() {
  return useQuery({
    queryKey: ADMIN_METRICS_KEY,
    queryFn: () => AdminService.metrics(),
  });
}

export function useAdminUsers(
  params: { page: number; limit: number; role?: UserRole; search?: string },
  options?: Omit<
    UseQueryOptions<Paginated<AdminUserListItem>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: adminUsersKey(params),
    queryFn: () => AdminService.listUsers(params),
    ...options,
  });
}

export function useAdminUser(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: adminUserKey(id ?? ""),
    queryFn: () => AdminService.getUser(id!),
    enabled: Boolean(id) && enabled,
  });
}

export function useAdminUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminUpdateUserPayload }) =>
      AdminService.updateUser(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
      void qc.invalidateQueries({ queryKey: adminUserKey(id) });
    },
  });
}

export function useAdminProducts(
  params: { page: number; limit: number; userId?: string; search?: string },
  options?: Omit<UseQueryOptions<Paginated<AdminProduct>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: adminProductsKey(params),
    queryFn: () => AdminService.listProducts(params),
    ...options,
  });
}

export function useAdminProduct(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: adminProductKey(id ?? ""),
    queryFn: () => AdminService.getProduct(id!),
    enabled: Boolean(id) && enabled,
  });
}

export function useAdminUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminUpdateProductPayload }) =>
      AdminService.updateProduct(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: adminProductKey(id) });
    },
  });
}

export function useAdminDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.deleteProduct(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useAdminConversations(
  params: { page: number; limit: number },
  options?: Omit<UseQueryOptions<Paginated<AdminConversationRow>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: adminConversationsKey(params),
    queryFn: () => AdminService.listConversations(params),
    ...options,
  });
}

export function useAdminConversationMessages(
  conversationId: string | undefined,
  params: { page: number; limit: number },
  enabled = true,
) {
  return useQuery({
    queryKey: adminMessagesKey(conversationId ?? "", params),
    queryFn: () => AdminService.conversationMessages(conversationId!, params),
    enabled: Boolean(conversationId) && enabled,
  });
}

export function useAdminAuditLogs(
  params: {
    page: number;
    limit: number;
    actorUserId?: string;
    entityType?: string;
  },
  options?: Omit<UseQueryOptions<Paginated<AuditLogEntry>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: adminAuditKey(params),
    queryFn: () => AdminService.listAuditLogs(params),
    ...options,
  });
}
