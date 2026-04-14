import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    if (!payload) return null;
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const data = JSON.parse(atob(base64)) as { role?: unknown };
    return typeof data.role === "string" ? data.role : null;
  } catch {
    return null;
  }
}

function homeForRole(role: string | null): string {
  if (role === "ADMIN") return "/admin";
  if (role === "OWNER") return "/dashboard";
  return "/";
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  const isOwnerRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/leads") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/settings");

  const isAdminRoute = pathname.startsWith("/admin");

  if ((isOwnerRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isGuestAuthPath = pathname === "/login" || pathname === "/register";
  if (isGuestAuthPath && token) {
    return NextResponse.redirect(new URL(homeForRole(parseJwtRole(token)), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
