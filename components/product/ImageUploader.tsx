"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageUploader(props: {
  file: File | null;
  previewUrl: string | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}) {
  const { file, previewUrl, onFile, disabled } = props;

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        onFile(accepted[0]);
      }
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)] p-6 transition-colors",
        isDragActive && "border-[var(--brand-primary)] bg-[var(--brand-glow)]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-[var(--radius-md)]">
          <Image src={previewUrl} alt="Preview" fill className="object-contain" unoptimized />
        </div>
      ) : (
        <>
          <ImagePlus className="mb-2 size-10 text-[var(--brand-primary)]" />
          <p className="text-center text-sm font-medium text-[var(--text-secondary)]">
            {file ? file.name : "Tap or drag a product photo"}
          </p>
          <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
            PNG, JPG or WebP — well-lit photos sell best
          </p>
        </>
      )}
    </div>
  );
}
