"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AiSuggestionPanel } from "@/components/product/AiSuggestionPanel";
import { MultiImageUploader } from "@/components/product/MultiImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { useImproveDescription } from "@/hooks/useAi";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  descriptionRaw: z.string().min(1, "Description required").max(500, "Max 500 characters"),
  sku: z.string().optional(),
  stockQuantity: z.string().optional(),
  categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const improve = useImproveDescription();
  const { data: categories } = useCategories();
  const [files, setFiles] = useState<File[]>([]);
  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState({ description_ai: "", caption_ai: "" });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: "", descriptionRaw: "", sku: "", stockQuantity: "", categoryId: "" },
  });

  const desc = watch("descriptionRaw");

  function onFilesChange(next: File[]) {
    setFiles(next);
  }

  async function runAi() {
    const name = watch("name");
    const raw = watch("descriptionRaw");
    if (raw.length < 20) return;
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

  function onSubmit(values: FormValues) {
    if (!files.length) {
      return;
    }
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    fd.append("name", values.name);
    fd.append("price", values.price);
    fd.append("descriptionRaw", values.descriptionRaw);
    if (values.sku?.trim()) fd.append("sku", values.sku.trim());
    if (values.stockQuantity?.trim()) {
      fd.append("stockQuantity", values.stockQuantity.trim());
    }
    if (values.categoryId) {
      fd.append("categoryIds", values.categoryId);
    }
    createProduct.mutate(fd, {
      onSuccess: () => router.push("/products"),
    });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-24">
      <PageHeader title="Add product" description="Photos first (up to 8), then details." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-base">Step 1 — Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiImageUploader files={files} previewUrls={previewUrls} onChange={onFilesChange} />
            {!files.length ? (
              <p className="mt-2 text-xs text-[var(--danger)]">At least one photo is required</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-base">Step 2 — Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                className={cn(errors.name && "border-[var(--danger)] ring-1 ring-[var(--danger)]")}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-[var(--danger)]">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                inputMode="decimal"
                className={cn(errors.price && "border-[var(--danger)] ring-1 ring-[var(--danger)]")}
                {...register("price")}
              />
              {errors.price ? (
                <p className="text-xs text-[var(--danger)]">{errors.price.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionRaw">Short description (max 500)</Label>
              <Textarea
                id="descriptionRaw"
                maxLength={500}
                className={cn(
                  errors.descriptionRaw && "border-[var(--danger)] ring-1 ring-[var(--danger)]",
                )}
                {...register("descriptionRaw")}
              />
              <p className="text-xs text-[var(--text-muted)]">{desc?.length ?? 0}/500</p>
              {errors.descriptionRaw ? (
                <p className="text-xs text-[var(--danger)]">{errors.descriptionRaw.message}</p>
              ) : null}
            </div>
            {desc && desc.length >= 20 ? (
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 w-full"
                onClick={() => void runAi()}
                disabled={improve.isPending}
              >
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
              <Label htmlFor="sku">SKU (optional)</Label>
              <Input id="sku" {...register("sku")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock quantity (optional)</Label>
              <Input id="stockQuantity" inputMode="numeric" {...register("stockQuantity")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category (optional)</Label>
              <select
                id="categoryId"
                className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
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

        <Button type="submit" className="min-h-11 w-full" disabled={createProduct.isPending || !files.length}>
          {createProduct.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Publish product"
          )}
        </Button>
      </form>
    </div>
  );
}
