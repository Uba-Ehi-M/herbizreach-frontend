import type { Metadata } from "next";
import type { ReactNode } from "react";
import OwnerLayoutClient from "./owner-layout-client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OwnerGroupLayout({ children }: { children: ReactNode }) {
  return <OwnerLayoutClient>{children}</OwnerLayoutClient>;
}
