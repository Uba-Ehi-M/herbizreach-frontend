"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeWaMeDigits } from "@/lib/ng-whatsapp-phone";

export function WhatsAppShareButton(props: {
  phone: string | null | undefined;
  message: string;
  label?: string;
  className?: string;
}) {
  const { phone, message, label = "Message on WhatsApp", className } = props;
  if (!phone) {
    return (
      <Button type="button" disabled variant="secondary" className={`min-h-11 ${className ?? ""}`}>
        WhatsApp not set
      </Button>
    );
  }
  const href = `https://wa.me/${normalizeWaMeDigits(phone)}?text=${encodeURIComponent(message)}`;
  return (
    <Button type="button" asChild className={`min-h-11 ${className ?? ""}`}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 size-5" />
        {label}
      </a>
    </Button>
  );
}
