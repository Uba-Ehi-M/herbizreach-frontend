"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

async function copyCaption(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    toast.message("No caption to copy yet.");
    return;
  }
  try {
    await navigator.clipboard.writeText(trimmed);
    toast.success("Caption copied");
  } catch {
    toast.error("Could not copy to clipboard.");
  }
}

export function AiSuggestionPanel(props: {
  open: boolean;
  descriptionAi: string;
  captionAi: string;
  onAccept: () => void;
  onDismiss: () => void;
  loading?: boolean;
}) {
  const { open, descriptionAi, captionAi, onAccept, onDismiss, loading } = props;
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--brand-secondary)]/40 bg-[var(--brand-glow)]"
        >
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)]">
                <Sparkles className="size-4" />
                AI suggestions
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={onDismiss} aria-label="Dismiss">
                <X className="size-4" />
              </Button>
            </div>
            {loading ? (
              <p className="text-sm text-[var(--text-muted)]">Crafting your copy…</p>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-[var(--text-muted)]">Description</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{descriptionAi}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-[var(--text-muted)]">Caption</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      onClick={() => void copyCaption(captionAi)}
                      disabled={!captionAi.trim()}
                      aria-label="Copy caption"
                      title="Copy caption"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{captionAi}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" className="min-h-11" onClick={onAccept}>
                    Use this description
                  </Button>
                  <Button type="button" variant="secondary" className="min-h-11" onClick={onDismiss}>
                    Keep mine
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
