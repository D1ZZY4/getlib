export function ThemePreview({ variant }: { variant: "light" | "dark" | "system" }) {
  if (variant === "system") {
    return (
      <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
        <div className="flex space-x-2">
          <div className="w-10 h-20 bg-white border rounded-md" />
          <div className="w-10 h-20 bg-gray-900 border border-gray-700 rounded-md" />
        </div>
        <span className="text-sm font-medium">System</span>
      </div>
    )
  }
  const dark = variant === "dark"
  return (
    <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
      <div className="space-y-2">
        <div
          className={
            dark
              ? "w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3"
              : "w-20 h-20 bg-white border rounded-md p-3"
          }
        >
          <div className="space-y-2">
            <div
              className={
                dark
                  ? "h-2 bg-gray-600 rounded w-3/4"
                  : "h-2 bg-gray-200 rounded w-3/4"
              }
            ></div>
            <div
              className={
                dark
                  ? "h-2 bg-gray-600 rounded w-1/2"
                  : "h-2 bg-gray-200 rounded w-1/2"
              }
            ></div>
            <div className="flex space-x-2">
              <div
                className={
                  dark
                    ? "h-2 w-2 bg-gray-500 rounded-full"
                    : "h-2 w-2 bg-gray-300 rounded-full"
                }
              ></div>
              <div
                className={
                  dark ? "h-2 bg-gray-600 rounded flex-1" : "h-2 bg-gray-200 rounded flex-1"
                }
              ></div>
            </div>
            <div className="flex space-x-2">
              <div
                className={
                  dark
                    ? "h-2 w-2 bg-gray-500 rounded-full"
                    : "h-2 w-2 bg-gray-300 rounded-full"
                }
              ></div>
              <div
                className={
                  dark ? "h-2 bg-gray-600 rounded flex-1" : "h-2 bg-gray-200 rounded flex-1"
                }
              ></div>
            </div>
          </div>
        </div>
        <span className="text-sm font-medium">
          {dark ? "Dark" : "Light"}
        </span>
      </div>
    </div>
  )
}
