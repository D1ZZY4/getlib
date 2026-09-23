// Pure visual swatch — no card frame here. The parent mode button
// already provides the bordered/selectable card, so this renders only
// the mini preview itself (fixes the old card-in-card look).
export function ThemePreview({
  variant,
}: {
  variant: "light" | "dark" | "system";
}) {
  if (variant === "system") {
    return (
      <div className="flex items-start gap-1.5" aria-hidden="true">
        <div className="w-9 h-14 bg-white border rounded" />
        <div className="w-9 h-14 bg-gray-900 border border-gray-700 rounded" />
      </div>
    );
  }
  const dark = variant === "dark";
  return (
    <div
      aria-hidden="true"
      className={
        dark
          ? "w-16 h-14 bg-gray-900 border border-gray-700 rounded p-2"
          : "w-16 h-14 bg-white border rounded p-2"
      }
    >
      <div className="space-y-1.5">
        <div className={dark ? "h-1.5 bg-gray-600 rounded w-3/4" : "h-1.5 bg-gray-200 rounded w-3/4"} />
        <div className={dark ? "h-1.5 bg-gray-600 rounded w-1/2" : "h-1.5 bg-gray-200 rounded w-1/2"} />
        <div className="flex items-center gap-1.5">
          <div className={dark ? "h-1.5 w-1.5 bg-gray-500 rounded-full" : "h-1.5 w-1.5 bg-gray-300 rounded-full"} />
          <div className={dark ? "h-1.5 bg-gray-600 rounded flex-1" : "h-1.5 bg-gray-200 rounded flex-1"} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className={dark ? "h-1.5 w-1.5 bg-gray-500 rounded-full" : "h-1.5 w-1.5 bg-gray-300 rounded-full"} />
          <div className={dark ? "h-1.5 bg-gray-600 rounded flex-1" : "h-1.5 bg-gray-200 rounded flex-1"} />
        </div>
      </div>
    </div>
  );
}
