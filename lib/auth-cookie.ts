const AUTH_COOKIE = "auth-token";
const MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}
