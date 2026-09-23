/**
 * Two-letter initials for avatars ("GetLib Admin" -> "GA").
 * Strips a leading "@", splits on whitespace, slash, and hyphen so scoped
 * package names and paths still produce readable initials. Falls back to
 * the first two characters for single-word input.
 */
export function getInitials(value: string): string {
  const normalized = value.replace(/^@/, "").trim();
  if (normalized.length === 0) return "";
  const parts = normalized.split(/[/\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return normalized.substring(0, 2).toUpperCase();
}
