import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "@/components/router/app-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { GetLibQueryProvider } from "@/lib/query-provider";
import { initGTM } from "@/utils/analytics";

// Get basename from environment (for deployment) or use empty string for development
const basename = import.meta.env.VITE_BASENAME || "";

function App() {
  // Initialize GTM on app load
  useEffect(() => {
    initGTM();
  }, []);

  return (
    <div
      className="font-sans antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarConfigProvider>
          <GetLibQueryProvider>
            <Router basename={basename}>
              <AppRouter />
            </Router>
            <Toaster />
          </GetLibQueryProvider>
        </SidebarConfigProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
