"use client";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useAdminDeleteProduct, useAdminProducts, useAdminUpdateProduct } from "@/hooks/useAdmin";
import type { AdminProduct } from "@/types/admin.types";

const PAGE_SIZE = 20;
const columnHelper = createColumnHelper<AdminProduct>();

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(search ? { search } : {}),
    }),
    [page, search],
  );

  const { data, isLoading, isError, refetch } = useAdminProducts(params);
  const updateProduct = useAdminUpdateProduct();
  const deleteProduct = useAdminDeleteProduct();

  const applySearch = () => {
    setPage(1);
    setSearch(searchDraft.trim() || undefined);
  };

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormPublished(p.isPublished);
    setFormFeatured(p.featured);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Product",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "owner",
        header: "Store",
        cell: (info) => {
          const o = info.row.original.owner;
          return (
            <span className="text-[var(--text-secondary)]">
              {o.businessName || o.email}
              {o.businessSlug ? (
                <span className="ml-1 text-xs text-[var(--text-muted)]">@{o.businessSlug}</span>
              ) : null}
            </span>
          );
        },
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => {
          const v = info.getValue();
          const n = Number(v);
          return Number.isFinite(n)
            ? n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
            : v;
        },
      }),
      columnHelper.accessor("isPublished", {
        header: "Published",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">Yes</Badge>
          ) : (
            <Badge variant="secondary">No</Badge>
          ),
      }),
      columnHelper.accessor("featured", {
        header: "Featured",
        cell: (info) =>
          info.getValue() ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>,
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy"),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => {
          const p = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-9"
                onClick={() => openEdit(p)}
              >
                <Pencil className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-9 text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                onClick={() => setDeleteId(p.id)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          );
        },
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

  const saveProduct = async () => {
    if (!editProduct) return;
    const priceNum = parseFloat(formPrice);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Enter a valid price");
      return;
    }
    try {
      await updateProduct.mutateAsync({
        id: editProduct.id,
        body: {
          name: formName !== editProduct.name ? formName : undefined,
          price: priceNum !== Number(editProduct.price) ? priceNum : undefined,
          isPublished: formPublished !== editProduct.isPublished ? formPublished : undefined,
          featured: formFeatured !== editProduct.featured ? formFeatured : undefined,
        },
      });
      toast.success("Product updated");
      setEditProduct(null);
    } catch {
      toast.error("Could not update product");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Could not delete product");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        className="!px-0"
        title="Products"
        description="Moderate listings across all stores."
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-search">Search by name</Label>
        <div className="flex gap-2">
          <Input
            id="product-search"
            placeholder="Product name…"
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

      {isError ? (
        <SectionError message="Could not load products." onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--bg-muted)]" />
      ) : (
        <>
          <AdminDataTable table={table} emptyMessage="No products found." />
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={data?.total ?? 0}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <Dialog open={Boolean(editProduct)} onOpenChange={(o) => !o && setEditProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Moderation fields — owner content is unchanged.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-3">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-[var(--text-muted)]">Visible on storefront</p>
              </div>
              <Switch checked={formPublished} onCheckedChange={setFormPublished} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-3">
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-[var(--text-muted)]">Highlight in listings</p>
              </div>
              <Switch checked={formFeatured} onCheckedChange={setFormFeatured} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditProduct(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void saveProduct()} disabled={updateProduct.isPending}>
              {updateProduct.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the product and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--danger)] hover:opacity-90"
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
