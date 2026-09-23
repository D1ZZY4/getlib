import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createGetLibQueryClient } from "./query-client";

export function GetLibQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => createGetLibQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
