"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { AiSuggestionPanel } from "@/components/product/AiSuggestionPanel";
import { ProductGalleryEditor } from "@/components/product/ProductGalleryEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { useImproveDescription } from "@/hooks/useAi";
import { useCategories } from "@/hooks/useCategories";
import { PRODUCTS_KEY, useDeleteProduct, useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import { ProductsService } from "@/services/products.service";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  descriptionRaw: z.string().min(1).max(500),
  sku: z.string().optional(),
  stockQuantity: z.string().optional(),
  categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const qc = useQueryClient();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const updateProduct = useUpdateProduct(id);
  const deleteProduct = useDeleteProduct();
  const improve = useImproveDescription();
  const { data: categories } = useCategories();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState({ description_ai: "", caption_ai: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [published, setPublished] = useState(true);

  const togglePublish = useMutation({
    mutationFn: (next: boolean) => ProductsService.update(id, { isPublished: next }),
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: [...PRODUCTS_KEY, id] });
      const prev = qc.getQueryData<Product>([...PRODUCTS_KEY, id]);
      if (prev) {
        qc.setQueryData([...PRODUCTS_KEY, id], { ...prev, isPublished: next });
      }
      const listPrev = qc.getQueryData<Product[]>(PRODUCTS_KEY);
      if (listPrev) {
        qc.setQueryData(
          PRODUCTS_KEY,
          listPrev.map((p) => (p.id === id ? { ...p, isPublished: next } : p)),
        );
      }
      setPublished(next);
      return { prev, listPrev };
    },
    onError: (_err, _next, ctx) => {
      if (ctx?.prev) qc.setQueryData([...PRODUCTS_KEY, id], ctx.prev);
      if (ctx?.listPrev) qc.setQueryData(PRODUCTS_KEY, ctx.listPrev);
      toast.error("Could not update publish status.");
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      void qc.invalidateQueries({ queryKey: [...PRODUCTS_KEY, id] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const desc = watch("descriptionRaw");

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      price: String(product.price),
      descriptionRaw: product.descriptionRaw.slice(0, 500),
      sku: product.sku ?? "",
      stockQuantity: String(product.stockQuantity ?? ""),
      categoryId: product.categories[0]?.id ?? "",
    });
    setPublished(product.isPublished);
  }, [product, reset]);

  async function runAi() {
    const name = watch("name");
    const raw = watch("descriptionRaw");
    if (!raw || raw.length < 20) return;
    setAiOpen(true);
    setAiResult({ description_ai: "", caption_ai: "" });
    try {
      const res = await improve.mutateAsync({
        descriptionRaw: raw,
        productName: name || undefined,
      });
      setAiResult(res);
    } catch {
      setAiOpen(false);
    }
  }

  function onSave(values: FormValues) {
    const categoryIds = values.categoryId ? [values.categoryId] : [];
    updateProduct.mutate({
      name: values.name,
      price: parseFloat(values.price),
      descriptionRaw: values.descriptionRaw,
      sku: values.sku?.trim() || undefined,
      stockQuantity: values.stockQuantity?.trim()
        ? parseInt(values.stockQuantity, 10)
        : undefined,
      categoryIds,
    });
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError || !product) {
    return <SectionError message="Product not found." onRetry={() => void refetch()} />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-24">
      <PageHeader title="Edit product" />
      <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Published</p>
          <p className="text-xs text-[var(--text-muted)]">Visible on your public store</p>
        </div>
        <Switch
          checked={published}
          onCheckedChange={(v) => togglePublish.mutate(v)}
          disabled={togglePublish.isPending}
        />
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <ProductGalleryEditor
          productId={id}
          imageUrls={
            product.imageUrls?.length
              ? product.imageUrls
              : product.imageUrl
                ? [product.imageUrl]
                : []
          }
        />

        <Card className="border-[var(--border-default)]">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className={cn(errors.name && "border-[var(--danger)]")}
                {...register("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                className={cn(errors.price && "border-[var(--danger)]")}
                {...register("price")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionRaw">Description</Label>
              <Textarea id="descriptionRaw" maxLength={500} {...register("descriptionRaw")} />
              <p className="text-xs text-[var(--text-muted)]">{desc?.length ?? 0}/500</p>
            </div>
            {desc && desc.length >= 20 ? (
              <Button type="button" variant="secondary" className="min-h-11 w-full" onClick={() => void runAi()}>
                <Sparkles className="mr-2 size-4" />
                Improve with AI
              </Button>
            ) : null}
            <AiSuggestionPanel
              open={aiOpen}
              descriptionAi={aiResult.description_ai}
              captionAi={aiResult.caption_ai}
              loading={improve.isPending}
              onAccept={() => {
                setValue("descriptionRaw", aiResult.description_ai);
                setAiOpen(false);
              }}
              onDismiss={() => setAiOpen(false)}
            />
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register("sku")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock</Label>
              <Input id="stockQuantity" {...register("stockQuantity")} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm"
                {...register("categoryId")}
              >
                <option value="">None</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-11 flex-1" disabled={updateProduct.isPending}>
            {updateProduct.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
          </Button>
          <Button type="button" variant="secondary" asChild className="min-h-11 flex-1">
            <Link href="/products">Cancel</Link>
          </Button>
        </div>
      </form>

      <Button
        type="button"
        variant="destructive"
        className="min-h-11 w-full"
        onClick={() => setDeleteOpen(true)}
      >
        Delete product
      </Button>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this product?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          deleteProduct.mutate(id, {
            onSuccess: () => router.push("/products"),
          });
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
