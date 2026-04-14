"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { SectionError } from "@/components/shared/SectionError";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  composeNgWhatsAppStored,
  sanitizeNgLocalInput,
  toNgLocalInputPart,
} from "@/lib/ng-whatsapp-phone";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

async function copyToClipboard(text: string, successMessage: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    toast.message("Nothing to copy yet — add text first.");
    return;
  }
  try {
    await navigator.clipboard.writeText(trimmed);
    toast.success(successMessage);
  } catch {
    toast.error("Could not copy to clipboard.");
  }
}

const schema = z.object({
  whatsAppPhone: z.string().optional(),
  tagline: z.string().max(500).optional(),
  description: z.string().max(4000).optional(),
  accentColor: z.string().optional(),
  showChatWidget: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function FieldCopyButton({
  onCopy,
  label,
}: {
  onCopy: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 shrink-0 text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
      aria-label={label}
      title={label}
      onClick={() => void onCopy()}
    >
      <Copy className="size-4" />
    </Button>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, isLoading, isError, refetch } = useStoreSettings();
  const update = useUpdateStoreSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      whatsAppPhone: "",
      tagline: "",
      description: "",
      accentColor: "#7c3aed",
      showChatWidget: true,
    },
  });

  const showChat = watch("showChatWidget");
  const whatsAppLocal = watch("whatsAppPhone") ?? "";
  const taglineValue = watch("tagline") ?? "";
  const descriptionValue = watch("description") ?? "";

  useEffect(() => {
    if (!data) return;
    reset({
      whatsAppPhone: toNgLocalInputPart(data.whatsAppPhone),
      tagline: data.tagline ?? "",
      description: data.description ?? "",
      accentColor: data.accentColor ?? "#7c3aed",
      showChatWidget: data.showChatWidget,
    });
  }, [data, reset]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError || !data) {
    return <SectionError message="Could not load settings." onRetry={() => void refetch()} />;
  }

  const slug = user?.businessSlug ?? "your-store";
  const previewUrl = `${appUrl.replace(/\/$/, "")}/store/${slug}`;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Store settings" description="Customize how your public page looks." />
      <Card className="border-[var(--border-default)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Your link</CardTitle>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Copy store link"
            title="Copy store link"
            onClick={() => void copyToClipboard(previewUrl, "Store link copied")}
          >
            <Copy className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="break-all rounded-[var(--radius-md)] bg-[var(--bg-muted)] p-3 text-sm text-[var(--brand-primary)]">
            {previewUrl}
          </p>
        </CardContent>
      </Card>

      <form
        className="space-y-6"
        onSubmit={handleSubmit((values) =>
          update.mutate({
            whatsAppPhone: composeNgWhatsAppStored(values.whatsAppPhone ?? "") ?? undefined,
            tagline: values.tagline?.trim() || undefined,
            description: values.description?.trim() || undefined,
            accentColor: values.accentColor?.trim() || undefined,
            showChatWidget: values.showChatWidget,
          }),
        )}
      >
        <Card className="border-[var(--border-default)]">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="whatsAppPhone">WhatsApp phone</Label>
              <p className="text-xs text-[var(--text-muted)]">
                Country code is set to Nigeria (+234). Type your number from the first digit after 0 — e.g.
                803 123 4567.
              </p>
              <div
                className={cn(
                  "flex min-h-11 items-stretch overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm transition-[color,box-shadow]",
                  errors.whatsAppPhone && "border-[var(--danger)] ring-1 ring-[var(--danger)]",
                )}
              >
                <span
                  className="flex shrink-0 items-center border-r border-[var(--border-default)] bg-[var(--bg-muted)] px-3 text-sm font-medium tabular-nums text-[var(--text-secondary)]"
                  aria-hidden
                >
                  +234
                </span>
                <Input
                  id="whatsAppPhone"
                  type="text"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="8031234567"
                  aria-describedby="whatsAppPhone-hint"
                  className="min-h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={whatsAppLocal}
                  onChange={(e) =>
                    setValue("whatsAppPhone", sanitizeNgLocalInput(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <p id="whatsAppPhone-hint" className="text-xs text-[var(--text-muted)]">
                If you paste +234080…, the extra 0 after 234 is removed automatically.
              </p>
              {errors.whatsAppPhone ? (
                <p className="text-xs text-[var(--danger)]">{errors.whatsAppPhone.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <Label htmlFor="tagline" className="text-[var(--text-primary)]">
                    Tagline
                  </Label>
                  <p className="text-xs text-[var(--text-muted)]">
                    Short line under your store name — copy for posts or stories
                  </p>
                </div>
                <FieldCopyButton
                  label="Copy tagline"
                  onCopy={() => void copyToClipboard(taglineValue, "Tagline copied")}
                />
              </div>
              <Textarea id="tagline" rows={3} {...register("tagline")} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <Label htmlFor="description" className="text-[var(--text-primary)]">
                    Description
                  </Label>
                  <p className="text-xs text-[var(--text-muted)]">
                    Longer intro for your store page — copy for bios or captions
                  </p>
                </div>
                <FieldCopyButton
                  label="Copy description"
                  onCopy={() => void copyToClipboard(descriptionValue, "Description copied")}
                />
              </div>
              <Textarea id="description" rows={5} {...register("description")} />
              {errors.description ? (
                <p className="text-xs text-[var(--danger)]">{errors.description.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColorHex">Accent color</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  className="h-11 w-16 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] p-1"
                  value={watch("accentColor")?.startsWith("#") ? watch("accentColor") : "#7c3aed"}
                  onChange={(e) => setValue("accentColor", e.target.value)}
                  aria-label="Pick accent color"
                />
                <Input
                  id="accentColorHex"
                  className={cn(errors.accentColor && "border-[var(--danger)]")}
                  {...register("accentColor")}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-3">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Show chat widget</p>
                <p className="text-xs text-[var(--text-muted)]">Let visitors message you from your store</p>
              </div>
              <Switch
                checked={showChat}
                onCheckedChange={(v) => setValue("showChatWidget", v)}
              />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="min-h-11 w-full" disabled={update.isPending}>
          {update.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
