"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
};

export function SearchField({ value, onChange, placeholder, label }: SearchFieldProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-tertiary" />
      <Input
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl pr-11 pl-9 text-lead [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-fg-tertiary active:bg-accent"
        >
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}
