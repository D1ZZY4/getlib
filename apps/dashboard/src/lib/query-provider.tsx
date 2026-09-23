import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createGetLibQueryClient } from "./query-client";

export function GetLibQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => createGetLibQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
