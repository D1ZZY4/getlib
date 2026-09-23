import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Dashboard root element (#root) is missing in index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
