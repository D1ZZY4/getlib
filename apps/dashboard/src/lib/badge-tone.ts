/**
 * Shared badge tones so status colors stay consistent across tables.
 * Each domain maps its own state to one of these tones instead of
 * copy-pasting the same Tailwind strings per table.
 */
export type BadgeTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "muted"
  | "violet"
  | "yellow";

export function toneClassName(tone: BadgeTone): string {
  if (tone === "success") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
  }
  if (tone === "info") {
    return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
  }
  if (tone === "warning") {
    return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
  }
  if (tone === "danger") {
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
  }
  if (tone === "violet") {
    return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20";
  }
  if (tone === "yellow") {
    return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
  }
  return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
}
