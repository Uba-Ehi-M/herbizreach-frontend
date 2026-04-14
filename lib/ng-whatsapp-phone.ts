const NG_CC = "234";

/** Digits only */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * After Nigeria country code 234, a leading 0 is wrong (e.g. +2340803… should be +234803…).
 */
function stripLeadingZeroAfter234(rest: string): string {
  return rest.replace(/^0+/, "");
}

/**
 * Parse stored phone (any format) into the local part shown after +234 in settings.
 */
export function toNgLocalInputPart(stored: string | null | undefined): string {
  if (!stored?.trim()) return "";
  const d = digitsOnly(stored);
  if (!d) return "";
  if (d.startsWith(NG_CC)) {
    return stripLeadingZeroAfter234(d.slice(NG_CC.length)).slice(0, 10);
  }
  return stripLeadingZeroAfter234(d).slice(0, 10);
}

/**
 * Sanitize what the user types/pastes into the local field (after +234).
 */
export function sanitizeNgLocalInput(raw: string): string {
  let d = digitsOnly(raw);
  if (d.startsWith(NG_CC)) {
    d = stripLeadingZeroAfter234(d.slice(NG_CC.length));
  } else {
    d = stripLeadingZeroAfter234(d);
  }
  return d.slice(0, 10);
}

/**
 * Build E.164-style value for API (+234…) or undefined if empty/invalid.
 */
export function composeNgWhatsAppStored(localDigits: string): string | undefined {
  const d = sanitizeNgLocalInput(localDigits);
  if (!d || d.length < 7) return undefined;
  return `+${NG_CC}${d}`;
}

/**
 * Normalize full digit string for wa.me (fixes 2340… → 234…).
 */
export function normalizeWaMeDigits(digits: string): string {
  const d = digitsOnly(digits);
  if (!d) return d;
  if (d.startsWith(NG_CC)) {
    return NG_CC + stripLeadingZeroAfter234(d.slice(NG_CC.length));
  }
  return d;
}
