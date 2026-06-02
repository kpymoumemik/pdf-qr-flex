"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyButton({ value, label = "Скопировать ссылку" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-100 hover:bg-white/12 sm:w-auto"
    >
      <Copy size={16} />
      {copied ? "Скопировано" : label}
    </button>
  );
}
