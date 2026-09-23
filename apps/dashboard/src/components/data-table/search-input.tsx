"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TableSearch({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(String(event.target.value))}
        className="pl-9"
        aria-label={label}
      />
    </div>
  );
}
