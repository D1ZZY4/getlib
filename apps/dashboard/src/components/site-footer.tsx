import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              to="/overview"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              GetLib
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Self-hosted, version-aware developer knowledge platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
