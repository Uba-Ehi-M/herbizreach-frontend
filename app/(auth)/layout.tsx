import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
