"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_MAX = 8;

export function MultiImageUploader(props: {
  files: File[];
  previewUrls: string[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}) {
  const { files, previewUrls, onChange, disabled, maxFiles = DEFAULT_MAX } = props;

  useEffect(() => {
    return () => {
      for (const u of previewUrls) {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      }
    };
  }, [previewUrls]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;
      const room = maxFiles - files.length;
      if (room <= 0) return;
      const next = [...files, ...accepted.slice(0, room)];
      onChange(next);
    },
    [files, maxFiles, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles,
    disabled: disabled || files.length >= maxFiles,
  });

  function removeAt(index: number) {
    const url = previewUrls[index];
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {previewUrls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previewUrls.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-muted)] ring-1 ring-[var(--border-default)]"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-1 top-1 size-8 rounded-full bg-[var(--bg-card)]/95 shadow-sm"
                onClick={() => removeAt(i)}
                disabled={disabled}
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="size-4" />
              </Button>
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {files.length < maxFiles ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)] p-4 transition-colors",
            isDragActive && "border-[var(--brand-primary)] bg-[var(--brand-glow)]",
            (disabled || files.length >= maxFiles) && "pointer-events-none opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mb-2 size-9 text-[var(--brand-primary)]" />
          <p className="text-center text-sm font-medium text-[var(--text-secondary)]">
            {files.length ? "Add more photos" : "Tap or drag product photos"}
          </p>
          <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
            Up to {maxFiles} images — first photo is the cover
          </p>
        </div>
      ) : (
        <p className="text-center text-xs text-[var(--text-muted)]">Maximum {maxFiles} images reached.</p>
      )}
    </div>
  );
}
