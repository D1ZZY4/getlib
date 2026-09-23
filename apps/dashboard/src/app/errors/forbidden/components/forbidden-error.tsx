"use client";

import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function ForbiddenError() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh flex-col items-center justify-center gap-8 p-8 md:gap-12 md:p-16">
      <div className="flex aspect-video w-240 items-center justify-center rounded-xl border bg-muted">
        <Logo size={96} className="text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">403</h1>
        <h2 className="mb-3 text-2xl font-semibold">Forbidden</h2>
        <p>
          Access to this resource is forbidden. You don't have the necessary
          permissions to view this page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/overview")}
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
