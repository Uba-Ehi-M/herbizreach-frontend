"use client";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminUpdateUser, useAdminUsers } from "@/hooks/useAdmin";
import type { AdminUserListItem } from "@/types/admin.types";
import type { UserRole } from "@/types/auth.types";

const PAGE_SIZE = 20;
const columnHelper = createColumnHelper<AdminUserListItem>();

const ROLE_OPTIONS: { value: "" | UserRole; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "OWNER", label: "Owner" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ADMIN", label: "Admin" },
];

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [editUser, setEditUser] = useState<AdminUserListItem | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("CUSTOMER");
  const [editDisabled, setEditDisabled] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(search ? { search } : {}),
      ...(roleFilter ? { role: roleFilter } : {}),
    }),
    [page, search, roleFilter],
  );

  const { data, isLoading, isError, refetch } = useAdminUsers(params);
  const updateUser = useAdminUpdateUser();

  const applySearch = () => {
    setPage(1);
    setSearch(searchDraft.trim() || undefined);
  };

  const openEdit = (u: AdminUserListItem) => {
    setEditUser(u);
    setEditRole(u.role);
    setEditDisabled(Boolean(u.disabledAt));
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("fullName", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
          <Badge variant={info.getValue() === "ADMIN" ? "default" : "secondary"}>
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("disabledAt", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="outline" className="text-[var(--danger)]">
              Disabled
            </Badge>
          ) : (
            <Badge variant="success">Active</Badge>
          ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Joined",
        cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy"),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-9"
            onClick={() => openEdit(info.row.original)}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data ? Math.ceil(data.total / PAGE_SIZE) : 0,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  const onSaveUser = async () => {
    if (!editUser) return;
    try {
      await updateUser.mutateAsync({
        id: editUser.id,
        body: {
          role: editRole !== editUser.role ? editRole : undefined,
          disabled: editDisabled !== Boolean(editUser.disabledAt) ? editDisabled : undefined,
        },
      });
      toast.success("User updated");
      setEditUser(null);
    } catch {
      toast.error("Could not update user");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        className="!px-0"
        title="Users"
        description="Search accounts, change roles, and disable access."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="user-search">Search</Label>
          <div className="flex gap-2">
            <Input
              id="user-search"
              placeholder="Email, name, business…"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
              className="min-w-0 flex-1"
            />
            <Button type="button" onClick={applySearch}>
              Search
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-48">
          <Label htmlFor="role-filter">Role</Label>
          <select
            id="role-filter"
            className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
            value={roleFilter ?? ""}
            onChange={(e) => {
              setPage(1);
              setRoleFilter((e.target.value || undefined) as UserRole | undefined);
            }}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError ? (
        <SectionError message="Could not load users." onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--bg-muted)]" />
      ) : (
        <>
          <AdminDataTable table={table} emptyMessage="No users match your filters." />
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={data?.total ?? 0}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <Dialog open={Boolean(editUser)} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              {editUser?.email} — changes apply immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-3">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Disabled</p>
                <p className="text-xs text-[var(--text-muted)]">User cannot sign in</p>
              </div>
              <Switch checked={editDisabled} onCheckedChange={setEditDisabled} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void onSaveUser()} disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
